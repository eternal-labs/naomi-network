/**
 * Context Network - Manages shared context between agents
 */

import { EventEmitter } from 'eventemitter3';
import { ContextMessage, ContextNetwork as IContextNetwork } from '../types';

export class ContextNetwork extends EventEmitter {
  private network: Map<string, IContextNetwork> = new Map();
  private globalContext: ContextMessage[] = [];
  private maxContextHistory = 1000;

  /**
   * Register an agent in the network
   */
  registerAgent(agentId: string, connectedAgents: string[] = []): void {
    this.network.set(agentId, {
      agentId,
      connectedAgents,
      sharedContext: [],
      contextHistory: []
    });
    this.emit('agent:registered', agentId);
  }

  /**
   * Share context from one agent to others
   */
  shareContext(
    fromAgentId: string,
    message: ContextMessage,
    targetAgentIds?: string[]
  ): void {
    const agentNetwork = this.network.get(fromAgentId);
    if (!agentNetwork) {
      throw new Error(`Agent ${fromAgentId} not registered in network`);
    }

    // Add to agent's own context history
    agentNetwork.contextHistory.push(message);
    if (agentNetwork.contextHistory.length > this.maxContextHistory) {
      agentNetwork.contextHistory.shift();
    }

    // Add to global context
    this.globalContext.push(message);
    if (this.globalContext.length > this.maxContextHistory) {
      this.globalContext.shift();
    }

    // Determine target agents
    const targets = targetAgentIds || agentNetwork.connectedAgents;

    // Share with target agents
    for (const targetId of targets) {
      const targetNetwork = this.network.get(targetId);
      if (targetNetwork) {
        targetNetwork.sharedContext.push(message);
        if (targetNetwork.sharedContext.length > this.maxContextHistory) {
          targetNetwork.sharedContext.shift();
        }
        this.emit('context:shared', {
          from: fromAgentId,
          to: targetId,
          message
        });
      }
    }

    this.emit('context:created', message);
  }

  /**
   * Get context for an agent
   */
  getAgentContext(agentId: string, limit?: number): ContextMessage[] {
    const agentNetwork = this.network.get(agentId);
    if (!agentNetwork) {
      return [];
    }

    const context = [
      ...agentNetwork.sharedContext,
      ...agentNetwork.contextHistory
    ].sort((a, b) => b.timestamp - a.timestamp);

    return limit ? context.slice(0, limit) : context;
  }

  /**
   * Get shared context between agents
   */
  getSharedContext(agentIds: string[], limit?: number): ContextMessage[] {
    const sharedMessages = this.globalContext.filter(msg =>
      agentIds.includes(msg.agentId)
    );

    const sorted = sharedMessages.sort((a, b) => b.timestamp - a.timestamp);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  /**
   * Connect two agents
   */
  connectAgents(agentId1: string, agentId2: string): void {
    const network1 = this.network.get(agentId1);
    const network2 = this.network.get(agentId2);

    if (network1 && !network1.connectedAgents.includes(agentId2)) {
      network1.connectedAgents.push(agentId2);
    }

    if (network2 && !network2.connectedAgents.includes(agentId1)) {
      network2.connectedAgents.push(agentId1);
    }

    this.emit('agents:connected', { agent1: agentId1, agent2: agentId2 });
  }

  /**
   * Disconnect two agents
   */
  disconnectAgents(agentId1: string, agentId2: string): void {
    const network1 = this.network.get(agentId1);
    const network2 = this.network.get(agentId2);

    if (network1) {
      network1.connectedAgents = network1.connectedAgents.filter(
        id => id !== agentId2
      );
    }

    if (network2) {
      network2.connectedAgents = network2.connectedAgents.filter(
        id => id !== agentId1
      );
    }

    this.emit('agents:disconnected', { agent1: agentId1, agent2: agentId2 });
  }

  /**
   * Get network topology
   */
  getNetworkTopology(): Map<string, string[]> {
    const topology = new Map<string, string[]>();
    for (const [agentId, network] of this.network.entries()) {
      topology.set(agentId, [...network.connectedAgents]);
    }
    return topology;
  }

  /**
   * Clear context for an agent
   */
  clearAgentContext(agentId: string): void {
    const agentNetwork = this.network.get(agentId);
    if (agentNetwork) {
      agentNetwork.sharedContext = [];
      agentNetwork.contextHistory = [];
      this.emit('context:cleared', agentId);
    }
  }

  /**
   * Get all registered agents
   */
  getRegisteredAgents(): string[] {
    return Array.from(this.network.keys());
  }
}

