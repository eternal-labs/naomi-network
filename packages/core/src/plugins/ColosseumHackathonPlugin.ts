/**
 * Colosseum Agent Hackathon Plugin
 * Enables Naomi agents to participate in the Colosseum Agent Hackathon
 */

import { BasePlugin } from './BasePlugin';
import { Agent } from '../agent/Agent';

const API_BASE = 'https://agents.colosseum.com/api';

interface HackathonConfig {
  apiKey?: string;
  agentName?: string;
  claimCode?: string;
}

export class ColosseumHackathonPlugin extends BasePlugin {
  name = 'colosseum-hackathon';
  version = '1.0.0';
  private config: HackathonConfig = {};

  async initialize(agent: Agent): Promise<void> {
    console.log(`Colosseum Hackathon plugin initialized for agent ${agent.config.id}`);
  }

  async execute(agent: Agent, input: any): Promise<any> {
    const action = input.action;

    switch (action) {
      case 'register':
        return await this.registerAgent(input.name);
      
      case 'getStatus':
        return await this.getStatus();
      
      case 'createProject':
        return await this.createProject(input.project);
      
      case 'updateProject':
        return await this.updateProject(input.project);
      
      case 'submitProject':
        return await this.submitProject();
      
      case 'getMyProject':
        return await this.getMyProject();
      
      case 'createForumPost':
        return await this.createForumPost(input.post);
      
      case 'listForumPosts':
        return await this.listForumPosts(input.options);
      
      case 'commentOnPost':
        return await this.commentOnPost(input.postId, input.body);
      
      case 'voteOnProject':
        return await this.voteOnProject(input.projectId, input.value);
      
      case 'getLeaderboard':
        return await this.getLeaderboard();
      
      case 'getHeartbeat':
        return await this.getHeartbeat();
      
      default:
        return { error: 'Unknown action', availableActions: [
          'register', 'getStatus', 'createProject', 'updateProject', 
          'submitProject', 'getMyProject', 'createForumPost', 'listForumPosts',
          'commentOnPost', 'voteOnProject', 'getLeaderboard', 'getHeartbeat'
        ]};
    }
  }

  private async registerAgent(name: string): Promise<any> {
    const response = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    const data = await response.json() as any;
    this.config.apiKey = data.apiKey;
    this.config.agentName = data.agent.name;
    this.config.claimCode = data.claimCode;

    return {
      success: true,
      agent: data.agent,
      claimCode: data.claimCode,
      claimUrl: data.claimUrl,
      skillUrl: data.skillUrl,
      heartbeatUrl: data.heartbeatUrl,
      warning: '⚠️ Save your API key! It is shown exactly once and cannot be recovered.'
    };
  }

  private async getStatus(): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/agents/status`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to get status: ${response.statusText}`);
    }

    return await response.json() as any;
  }

  private async createProject(project: any): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/my-project`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create project: ${error}`);
    }

    return await response.json() as any;
  }

  private async updateProject(project: any): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/my-project`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update project: ${error}`);
    }

    return await response.json() as any;
  }

  private async submitProject(): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/my-project/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to submit project: ${error}`);
    }

    return await response.json() as any;
  }

  private async getMyProject(): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/my-project`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to get project: ${response.statusText}`);
    }

    return await response.json() as any;
  }

  private async createForumPost(post: { title: string; body: string; tags?: string[] }): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/forum/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create post: ${error}`);
    }

    return await response.json() as any;
  }

  private async listForumPosts(options: { sort?: string; limit?: number; tags?: string[] } = {}): Promise<any> {
    const params = new URLSearchParams();
    if (options.sort) params.append('sort', options.sort);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.tags) {
      options.tags.forEach(tag => params.append('tags', tag));
    }

    const response = await fetch(`${API_BASE}/forum/posts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to list posts: ${response.statusText}`);
    }

    return await response.json() as any;
  }

  private async commentOnPost(postId: number, body: string): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to comment: ${error}`);
    }

    return await response.json() as any;
  }

  private async voteOnProject(projectId: number, value: number = 1): Promise<any> {
    if (!this.config.apiKey) {
      throw new Error('Not registered. Call register action first.');
    }

    const response = await fetch(`${API_BASE}/projects/${projectId}/vote`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to vote: ${error}`);
    }

    return await response.json() as any;
  }

  private async getLeaderboard(): Promise<any> {
    const response = await fetch(`${API_BASE}/leaderboard`);
    
    if (!response.ok) {
      throw new Error(`Failed to get leaderboard: ${response.statusText}`);
    }

    return await response.json() as any;
  }

  private async getHeartbeat(): Promise<any> {
    const response = await fetch('https://colosseum.com/heartbeat.md');
    
    if (!response.ok) {
      throw new Error(`Failed to get heartbeat: ${response.statusText}`);
    }

    return {
      content: await response.text(),
      url: 'https://colosseum.com/heartbeat.md'
    };
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  getConfig(): HackathonConfig {
    return { ...this.config };
  }
}

