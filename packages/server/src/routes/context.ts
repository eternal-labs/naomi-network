import { Router } from 'express';
import { agentManager } from '../agentManager';

export const contextRoutes = Router();

// Get context for an agent
contextRoutes.get('/agent/:id', (req, res) => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const context = agentManager.getContextNetwork().getAgentContext(id, limit);
    res.json({ context });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get shared context between agents
contextRoutes.post('/shared', (req, res) => {
  try {
    const { agentIds, limit } = req.body;
    const context = agentManager.getContextNetwork().getSharedContext(
      agentIds,
      limit
    );
    res.json({ context });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Clear context for an agent
contextRoutes.delete('/agent/:id', (req, res) => {
  try {
    agentManager.getContextNetwork().clearAgentContext(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

