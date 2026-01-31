import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentList from './components/AgentList';
import NetworkView from './components/NetworkView';
import ContextView from './components/ContextView';
import './App.css';

const API_BASE = '/api';

interface Agent {
  id: string;
  config: {
    name: string;
    description?: string;
  };
  isActive: boolean;
}

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'network' | 'context'>('agents');

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/agents`);
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const createAgent = async (config: any) => {
    try {
      await axios.post(`${API_BASE}/agents`, config);
      fetchAgents();
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Naomi Agent Network</h1>
        <p>Multi-Agent System with Connected Context</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'agents' ? 'active' : ''}
          onClick={() => setActiveTab('agents')}
        >
          Agents
        </button>
        <button
          className={activeTab === 'network' ? 'active' : ''}
          onClick={() => setActiveTab('network')}
        >
          Network
        </button>
        <button
          className={activeTab === 'context' ? 'active' : ''}
          onClick={() => setActiveTab('context')}
        >
          Context
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'agents' && (
          <AgentList
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            onCreateAgent={createAgent}
          />
        )}
        {activeTab === 'network' && <NetworkView />}
        {activeTab === 'context' && (
          <ContextView selectedAgent={selectedAgent} />
        )}
      </main>
    </div>
  );
}

export default App;

