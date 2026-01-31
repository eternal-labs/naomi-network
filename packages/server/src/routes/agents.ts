import { Router } from 'express';
import { agentManager } from '../agentManager';
import { AgentConfig } from '@naomi/core';

export const agentRoutes = Router();

// Get all agents
agentRoutes.get('/', (req, res) => {
  try {
    const agents = agentManager.getAllAgentStates();
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get agent by ID
agentRoutes.get('/:id', (req, res) => {
  try {
    const agent = agentManager.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json({ agent: agent.getState() });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create new agent
agentRoutes.post('/', async (req, res) => {
  try {
    const config: AgentConfig = req.body;
    const agent = await agentManager.createAgent(config);
    res.status(201).json({ agent: agent.getState() });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Update agent
agentRoutes.put('/:id', async (req, res) => {
  try {
    const agent = agentManager.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Update config
    Object.assign(agent.config, req.body);
    res.json({ agent: agent.getState() });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete agent
agentRoutes.delete('/:id', async (req, res) => {
  try {
    await agentManager.removeAgent(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Process message with agent
agentRoutes.post('/:id/process', async (req, res) => {
  try {
    const agent = agentManager.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const { message, metadata } = req.body;
    const response = await agent.process(message, metadata);
    
    // Share context updates
    if (response.contextUpdates) {
      for (const contextUpdate of response.contextUpdates) {
        agentManager.getContextNetwork().shareContext(
          req.params.id,
          contextUpdate,
          response.targetAgents
        );
      }
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Share knowledge
agentRoutes.post('/:id/knowledge', async (req, res) => {
  try {
    const agent = agentManager.getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const { knowledge, targetAgents, metadata } = req.body;
    await agent.shareKnowledge(knowledge, targetAgents, metadata);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

