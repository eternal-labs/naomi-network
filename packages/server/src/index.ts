import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { agentManager } from './agentManager';
import { agentRoutes } from './routes/agents';
import { contextRoutes } from './routes/context';
import { networkRoutes } from './routes/network';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/network', networkRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// WebSocket server for real-time updates
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send initial state
  ws.send(JSON.stringify({
    type: 'initial_state',
    data: {
      agents: agentManager.getAllAgentStates(),
      topology: Array.from(agentManager.getNetworkTopology().entries())
    }
  }));

  // Forward agent manager events to WebSocket clients
  const forwardEvent = (event: string, data: any) => {
    ws.send(JSON.stringify({ type: event, data }));
  };

  agentManager.on('agent:created', (agentId) => {
    forwardEvent('agent:created', { agentId });
  });

  agentManager.on('agent:processed', (data) => {
    forwardEvent('agent:processed', data);
  });

  agentManager.on('context:shared', (data) => {
    forwardEvent('context:shared', data);
  });

  agentManager.on('agents:connected', (data) => {
    forwardEvent('agents:connected', data);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Naomi Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`);
});

