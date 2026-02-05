import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const API_BASE = '/api';

interface Agent {
  id: string;
  config: {
    name: string;
    description?: string;
  };
  isActive: boolean;
}

interface Props {
  agents: Agent[];
  selectedAgent: string | null;
  onSelectAgent: (id: string) => void;
  onCreateAgent: (config: any) => Promise<void>;
}

export default function AgentList({ agents, selectedAgent, onSelectAgent, onCreateAgent }: Props) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    systemPrompt: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateAgent({
      ...formData,
      id: formData.id || `agent_${Date.now()}`
    });
    setShowCreateForm(false);
    setFormData({ id: '', name: '', description: '', systemPrompt: '' });
  };

  const handleProcessMessage = async (agentId: string, message: string) => {
    try {
      const response = await axios.post(`${API_BASE}/agents/${agentId}/process`, {
        message
      });
      alert(`Response: ${response.data.response.content}`);
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Agents ({agents.length})</h2>
          <button className="button" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : '+ Create Agent'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
            <label className="label">Agent ID</label>
            <input
              className="input"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="agent_1 (auto-generated if empty)"
            />

            <label className="label">Name</label>
            <input
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <label className="label">Description</label>
            <input
              className="input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <label className="label">System Prompt</label>
            <textarea
              className="input"
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={3}
            />

            <button type="submit" className="button">Create Agent</button>
          </form>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {agents.map((agent) => (
          <div key={agent.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>{agent.config.name}</h3>
                <p style={{ color: '#888', marginTop: '0.5rem' }}>
                  {agent.config.description || 'No description'}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  ID: {agent.id} • {agent.isActive ? '🟢 Active' : '🔴 Inactive'}
                </p>
              </div>
              <button
                className="button-secondary"
                onClick={() => onSelectAgent(agent.id)}
                style={{ marginLeft: '1rem' }}
              >
                {selectedAgent === agent.id ? 'Selected' : 'Select'}
              </button>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
              <input
                className="input"
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleProcessMessage(agent.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}

        {agents.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#888' }}>No agents yet. Create your first agent to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}


