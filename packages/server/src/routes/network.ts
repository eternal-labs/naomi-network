import { Router } from 'express';
import { agentManager } from '../agentManager';

export const networkRoutes = Router();

// Get network topology
networkRoutes.get('/topology', (req, res) => {
  try {
    const topology = agentManager.getNetworkTopology();
    const topologyArray = Array.from(topology.entries()).map(([agentId, connections]) => ({
      agentId,
      connections
    }));
    res.json({ topology: topologyArray });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Connect two agents
networkRoutes.post('/connect', (req, res) => {
  try {
    const { agentId1, agentId2 } = req.body;
    agentManager.connectAgents(agentId1, agentId2);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all registered agents
networkRoutes.get('/agents', (req, res) => {
  try {
    const agents = agentManager.getContextNetwork().getRegisteredAgents();
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

