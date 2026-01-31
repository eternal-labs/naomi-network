/**
 * Example Plugin: Memory Plugin
 * Adds memory capabilities to agents
 */

import { BasePlugin } from '../BasePlugin';
import { Agent } from '../../agent/Agent';

interface Memory {
  key: string;
  value: any;
  timestamp: number;
}

export class MemoryPlugin extends BasePlugin {
  name = 'memory';
  version = '1.0.0';
  private memories: Map<string, Memory[]> = new Map();

  async initialize(agent: Agent): Promise<void> {
    this.memories.set(agent.config.id, []);
    console.log(`Memory plugin initialized for agent ${agent.config.id}`);
  }

  async execute(agent: Agent, input: any): Promise<any> {
    const agentId = agent.config.id;
    const agentMemories = this.memories.get(agentId) || [];

    if (input.action === 'store') {
      const memory: Memory = {
        key: input.key,
        value: input.value,
        timestamp: Date.now()
      };
      agentMemories.push(memory);
      this.memories.set(agentId, agentMemories);
      return { success: true, memory };
    }

    if (input.action === 'retrieve') {
      const key = input.key;
      const memory = agentMemories.find(m => m.key === key);
      return { found: !!memory, memory };
    }

    if (input.action === 'list') {
      return { memories: agentMemories };
    }

    if (input.action === 'clear') {
      this.memories.set(agentId, []);
      return { success: true };
    }

    return { error: 'Unknown action' };
  }

  async cleanup(): Promise<void> {
    // Cleanup if needed
  }
}

