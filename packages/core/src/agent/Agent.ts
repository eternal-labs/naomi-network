import { EventEmitter } from 'eventemitter3';
import {
  AgentConfig,
  AgentState,
  AgentResponse,
  ContextMessage,
  Plugin,
  ModelProvider
} from '../types';
import { ContextNetwork } from '../context/ContextNetwork';

export class Agent extends EventEmitter {
  public config: AgentConfig;
  public state: AgentState;
  private plugins: Map<string, Plugin> = new Map();
  private modelProvider?: ModelProvider;
  private contextNetwork: ContextNetwork;

  constructor(config: AgentConfig, contextNetwork: ContextNetwork) {
    super();
    this.config = config;
    this.contextNetwork = contextNetwork;
    this.state = {
      id: config.id,
      config,
      network: {
        agentId: config.id,
        connectedAgents: [],
        sharedContext: [],
        contextHistory: []
      },
      isActive: false,
      lastActivity: Date.now()
    };

    // Register agent in network
    this.contextNetwork.registerAgent(config.id, []);
  }

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    this.state.isActive = true;
    this.state.lastActivity = Date.now();

    // Initialize plugins
    for (const [name, plugin] of this.plugins.entries()) {
      try {
        await plugin.initialize(this);
        this.emit('plugin:initialized', name);
      } catch (error) {
        this.emit('plugin:error', { name, error });
      }
    }

    this.emit('agent:initialized', this.config.id);
  }

  /**
   * Process a message and generate a response
   */
  async process(input: string, metadata?: Record<string, any>): Promise<AgentResponse> {
    this.state.lastActivity = Date.now();

    const context = this.contextNetwork.getAgentContext(this.config.id, 50);
    const contextSummary = this.summarizeContext(context);
    const prompt = this.buildPrompt(input, contextSummary);

    let content = '';
    if (this.modelProvider) {
      content = await this.modelProvider.generate(prompt, {
        temperature: this.config.temperature || 0.7,
        maxTokens: this.config.maxTokens || 1000
      });
    } else {
      content = `[Agent ${this.config.name}] I received: ${input}`;
    }

    const contextMessage: ContextMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId: this.config.id,
      content: input,
      timestamp: Date.now(),
      metadata: {
        response: content,
        ...metadata
      },
      contextType: 'message'
    };

    const response: AgentResponse = {
      content,
      contextUpdates: [contextMessage],
      metadata
    };

    this.emit('agent:processed', { input, response });
    return response;
  }

  /**
   * Share knowledge with the network
   */
  async shareKnowledge(
    knowledge: string,
    targetAgents?: string[],
    metadata?: Record<string, any>
  ): Promise<void> {
    const knowledgeMessage: ContextMessage = {
      id: `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId: this.config.id,
      content: knowledge,
      timestamp: Date.now(),
      metadata,
      contextType: 'knowledge'
    };

    this.contextNetwork.shareContext(
      this.config.id,
      knowledgeMessage,
      targetAgents
    );

    this.emit('knowledge:shared', knowledgeMessage);
  }

  /**
   * Connect to another agent
   */
  connectTo(agentId: string): void {
    this.contextNetwork.connectAgents(this.config.id, agentId);
    if (!this.state.network.connectedAgents.includes(agentId)) {
      this.state.network.connectedAgents.push(agentId);
    }
    this.emit('agent:connected', agentId);
  }

  /**
   * Disconnect from another agent
   */
  disconnectFrom(agentId: string): void {
    this.contextNetwork.disconnectAgents(this.config.id, agentId);
    this.state.network.connectedAgents = this.state.network.connectedAgents.filter(
      id => id !== agentId
    );
    this.emit('agent:disconnected', agentId);
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
    this.emit('plugin:registered', plugin.name);
  }

  /**
   * Execute a plugin
   */
  async executePlugin(name: string, input: any): Promise<any> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    return await plugin.execute(this, input);
  }

  /**
   * Set model provider
   */
  setModelProvider(provider: ModelProvider): void {
    this.modelProvider = provider;
    this.emit('model:provider:set', provider.name);
  }

  /**
   * Get agent state
   */
  getState(): AgentState {
    return {
      ...this.state,
      network: {
        ...this.state.network,
        sharedContext: this.contextNetwork.getAgentContext(this.config.id, 100)
      }
    };
  }

  /**
   * Build prompt with context
   */
  private buildPrompt(input: string, contextSummary: string): string {
    const systemPrompt = this.config.systemPrompt || 
      `You are ${this.config.name}, an AI agent in a network. You can share context with other agents.`;
    
    return `${systemPrompt}

${contextSummary ? `Recent context from the network:\n${contextSummary}\n` : ''}

User input: ${input}

Response:`;
  }

  /**
   * Summarize context for prompt
   */
  private summarizeContext(context: ContextMessage[]): string {
    if (context.length === 0) return '';
    
    return context
      .slice(-10) // Last 10 messages
      .map(msg => {
        const agentName = msg.agentId;
        const time = new Date(msg.timestamp).toLocaleTimeString();
        return `[${time}] ${agentName}: ${msg.content}`;
      })
      .join('\n');
  }

  /**
   * Cleanup and shutdown
   */
  async shutdown(): Promise<void> {
    this.state.isActive = false;

    // Cleanup plugins
    for (const [name, plugin] of this.plugins.entries()) {
      if (plugin.cleanup) {
        try {
          await plugin.cleanup();
        } catch (error) {
          this.emit('plugin:cleanup:error', { name, error });
        }
      }
    }

    this.emit('agent:shutdown', this.config.id);
  }
}


