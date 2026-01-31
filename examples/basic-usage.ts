/**
 * Basic usage example for Naomi Agent Network
 */

import { AgentManager, AnthropicProvider } from '@naomi/core';

async function main() {
  // Create agent manager
  const manager = new AgentManager();

  // Get API key from environment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  // Create first agent
  const agent1 = await manager.createAgent({
    id: 'agent_1',
    name: 'Alice',
    description: 'A helpful assistant',
    systemPrompt: 'You are Alice, a friendly and helpful AI assistant powered by Claude.'
  });

  // Set Claude as model provider
  agent1.setModelProvider(new AnthropicProvider(apiKey));

  // Create second agent
  const agent2 = await manager.createAgent({
    id: 'agent_2',
    name: 'Bob',
    description: 'A technical expert',
    systemPrompt: 'You are Bob, a technical expert who provides detailed explanations, powered by Claude.'
  });

  agent2.setModelProvider(new AnthropicProvider(apiKey));

  // Connect the agents
  manager.connectAgents('agent_1', 'agent_2');

  // Process a message with agent1
  console.log('Processing message with Alice...');
  const response1 = await agent1.process('Hello, can you help me?');
  console.log('Alice:', response1.content);

  // Share context updates
  if (response1.contextUpdates) {
    for (const update of response1.contextUpdates) {
      manager.getContextNetwork().shareContext('agent_1', update);
    }
  }

  // Process a message with agent2 (now has context from agent1)
  console.log('\nProcessing message with Bob (with context from Alice)...');
  const response2 = await agent2.process('What did Alice just say?');
  console.log('Bob:', response2.content);

  // Share knowledge
  console.log('\nSharing knowledge...');
  await agent1.shareKnowledge(
    'The user is working on a TypeScript project',
    ['agent_2']
  );

  // View network topology
  console.log('\nNetwork Topology:');
  const topology = manager.getNetworkTopology();
  for (const [agentId, connections] of topology.entries()) {
    console.log(`${agentId} -> ${connections.join(', ')}`);
  }

  // Get context for an agent
  console.log('\nContext for agent_2:');
  const context = manager.getContextNetwork().getAgentContext('agent_2', 10);
  context.forEach(msg => {
    console.log(`  [${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.agentId}: ${msg.content}`);
  });
}

main().catch(console.error);

