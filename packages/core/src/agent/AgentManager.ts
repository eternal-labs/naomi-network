import { EventEmitter } from 'eventemitter3';
import { Agent } from './Agent';
import { AgentConfig, AgentState } from '../types';
import { ContextNetwork } from '../context/ContextNetwork';

export class AgentManager extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private contextNetwork: ContextNetwork;

  constructor() {
    super();
    this.contextNetwork = new ContextNetwork();
    
    // Forward context network events
    this.contextNetwork.on('context:shared', (data) => {
      this.emit('context:shared', data);
    });
  }

  /**
   * Create and register a new agent
   */
  async createAgent(config: AgentConfig): Promise<Agent> {
    if (this.agents.has(config.id)) {
      throw new Error(`Agent with id ${config.id} already exists`);
    }

    const agent = new Agent(config, this.contextNetwork);
    this.agents.set(config.id, agent);

    // Forward agent events
    agent.on('agent:processed', (data) => {
      this.emit('agent:processed', { agentId: config.id, ...data });
    });

    await agent.initialize();
    this.emit('agent:created', config.id);
    return agent;
  }

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get all agent states
   */
  getAllAgentStates(): AgentState[] {
    return Array.from(this.agents.values()).map(agent => agent.getState());
  }

  /**
   * Remove an agent
   */
  async removeAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      await agent.shutdown();
      this.agents.delete(agentId);
      this.emit('agent:removed', agentId);
    }
  }

  /**
   * Connect two agents
   */
  connectAgents(agentId1: string, agentId2: string): void {
    const agent1 = this.agents.get(agentId1);
    const agent2 = this.agents.get(agentId2);

    if (!agent1 || !agent2) {
      throw new Error('One or both agents not found');
    }

    agent1.connectTo(agentId2);
    agent2.connectTo(agentId1);
    this.emit('agents:connected', { agent1: agentId1, agent2: agentId2 });
  }

  /**
   * Get network topology
   */
  getNetworkTopology(): Map<string, string[]> {
    return this.contextNetwork.getNetworkTopology();
  }

  /**
   * Get context network instance
   */
  getContextNetwork(): ContextNetwork {
    return this.contextNetwork;
  }
}

