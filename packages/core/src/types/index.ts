/**
 * Core types for Naomi Agent Network
 */

export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  model?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  capabilities?: string[];
  plugins?: string[];
}

export interface ContextMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
  contextType?: 'message' | 'knowledge' | 'state' | 'event';
}

export interface ContextNetwork {
  agentId: string;
  connectedAgents: string[];
  sharedContext: ContextMessage[];
  contextHistory: ContextMessage[];
}

export interface AgentState {
  id: string;
  config: AgentConfig;
  network: ContextNetwork;
  isActive: boolean;
  lastActivity: number;
}

export interface AgentResponse {
  content: string;
  contextUpdates?: ContextMessage[];
  targetAgents?: string[];
  metadata?: Record<string, any>;
}

export interface Plugin {
  name: string;
  version: string;
  initialize: (agent: Agent) => Promise<void>;
  execute: (agent: Agent, input: any) => Promise<any>;
  cleanup?: () => Promise<void>;
}

export interface ModelProvider {
  name: string;
  generate: (prompt: string, options?: any) => Promise<string>;
  stream?: (prompt: string, options?: any) => AsyncGenerator<string>;
}

