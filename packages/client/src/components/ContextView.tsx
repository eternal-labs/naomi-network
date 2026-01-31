import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_BASE = '/api';

interface ContextMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: number;
  contextType?: string;
}

interface Props {
  selectedAgent: string | null;
}

export default function ContextView({ selectedAgent }: Props) {
  const [context, setContext] = useState<ContextMessage[]>([]);
  const [knowledgeForm, setKnowledgeForm] = useState({ knowledge: '', targetAgents: '' });

  useEffect(() => {
    if (selectedAgent) {
      fetchContext();
      const interval = setInterval(fetchContext, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedAgent]);

  const fetchContext = async () => {
    if (!selectedAgent) return;
    try {
      const response = await axios.get(`${API_BASE}/context/agent/${selectedAgent}`);
      setContext(response.data.context);
    } catch (error) {
      console.error('Failed to fetch context:', error);
    }
  };

  const handleShareKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    try {
      const targetAgents = knowledgeForm.targetAgents
        ? knowledgeForm.targetAgents.split(',').map(s => s.trim())
        : undefined;
      
      await axios.post(`${API_BASE}/agents/${selectedAgent}/knowledge`, {
        knowledge: knowledgeForm.knowledge,
        targetAgents
      });
      setKnowledgeForm({ knowledge: '', targetAgents: '' });
      fetchContext();
    } catch (error) {
      console.error('Failed to share knowledge:', error);
    }
  };

  if (!selectedAgent) {
    return (
      <div className="card">
        <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
          Select an agent to view its context
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Context for {selectedAgent}</h2>
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          {context.length} context messages
        </p>

        <form onSubmit={handleShareKnowledge} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1rem' }}>Share Knowledge</h3>
          <label className="label">Knowledge</label>
          <textarea
            className="input"
            value={knowledgeForm.knowledge}
            onChange={(e) => setKnowledgeForm({ ...knowledgeForm, knowledge: e.target.value })}
            rows={3}
            required
          />
          <label className="label">Target Agents (comma-separated, leave empty for all connected)</label>
          <input
            className="input"
            value={knowledgeForm.targetAgents}
            onChange={(e) => setKnowledgeForm({ ...knowledgeForm, targetAgents: e.target.value })}
            placeholder="agent_1, agent_2"
          />
          <button type="submit" className="button">Share Knowledge</button>
        </form>
      </div>

      <div className="card">
        <h3>Context History</h3>
        {context.length === 0 ? (
          <p style={{ color: '#888', marginTop: '1rem' }}>No context yet</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {context.slice().reverse().map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: '#2a2a2a',
                  borderRadius: '6px',
                  border: '1px solid #444'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#667eea', fontWeight: 'bold' }}>{msg.agentId}</span>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: '#e0e0e0' }}>{msg.content}</div>
                {msg.contextType && (
                  <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Type: {msg.contextType}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

