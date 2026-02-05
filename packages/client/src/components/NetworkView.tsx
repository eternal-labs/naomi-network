import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_BASE = '/api';

interface TopologyNode {
  agentId: string;
  connections: string[];
}

export default function NetworkView() {
  const [topology, setTopology] = useState<TopologyNode[]>([]);
  const [connectForm, setConnectForm] = useState({ agent1: '', agent2: '' });

  useEffect(() => {
    fetchTopology();
    const interval = setInterval(fetchTopology, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchTopology = async () => {
    try {
      const response = await axios.get(`${API_BASE}/network/topology`);
      setTopology(response.data.topology);
    } catch (error) {
      console.error('Failed to fetch topology:', error);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/network/connect`, {
        agentId1: connectForm.agent1,
        agentId2: connectForm.agent2
      });
      setConnectForm({ agent1: '', agent2: '' });
      fetchTopology();
    } catch (error) {
      alert('Failed to connect agents: ' + (error as any).response?.data?.error);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Network Topology</h2>
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          Visualize agent connections and context flow
        </p>

        <form onSubmit={handleConnect} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1rem' }}>Connect Agents</h3>
          <label className="label">Agent 1 ID</label>
          <input
            className="input"
            value={connectForm.agent1}
            onChange={(e) => setConnectForm({ ...connectForm, agent1: e.target.value })}
            placeholder="agent_1"
            required
          />
          <label className="label">Agent 2 ID</label>
          <input
            className="input"
            value={connectForm.agent2}
            onChange={(e) => setConnectForm({ ...connectForm, agent2: e.target.value })}
            placeholder="agent_2"
            required
          />
          <button type="submit" className="button">Connect</button>
        </form>
      </div>

      <div className="card">
        <h3>Network Graph</h3>
        {topology.length === 0 ? (
          <p style={{ color: '#888', marginTop: '1rem' }}>No agents in network</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {topology.map((node) => (
              <div
                key={node.agentId}
                style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  background: '#2a2a2a',
                  borderRadius: '6px',
                  border: '1px solid #444'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
                  {node.agentId}
                </div>
                {node.connections.length > 0 ? (
                  <div style={{ color: '#888', fontSize: '0.9rem' }}>
                    Connected to: {node.connections.join(', ')}
                  </div>
                ) : (
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>No connections</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


