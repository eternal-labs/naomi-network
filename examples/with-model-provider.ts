/**
 * Example: Using Claude with agents
 */

import { AgentManager, AnthropicProvider } from '@naomi/core';

async function main() {
  const manager = new AgentManager();

  // Get API key from environment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required. Set it in your .env file.');
  }

  // Create first agent with Claude
  const agent1 = await manager.createAgent({
    id: 'claude_agent_1',
    name: 'Claude Assistant',
    systemPrompt: 'You are a helpful assistant powered by Anthropic Claude.'
  });

  agent1.setModelProvider(new AnthropicProvider(apiKey));

  // Create second agent with Claude
  const agent2 = await manager.createAgent({
    id: 'claude_agent_2',
    name: 'Claude Expert',
    systemPrompt: 'You are an expert assistant powered by Anthropic Claude, specializing in detailed explanations.'
  });

  agent2.setModelProvider(new AnthropicProvider(apiKey));

  // Connect the agents
  manager.connectAgents('claude_agent_1', 'claude_agent_2');

  // Process a message with first agent
  console.log('\n=== Processing with Claude Agent 1 ===');
  const response1 = await agent1.process('What is TypeScript?');
  console.log('Response:', response1.content);

  // Share context
  if (response1.contextUpdates) {
    for (const update of response1.contextUpdates) {
      manager.getContextNetwork().shareContext('claude_agent_1', update);
    }
  }

  // Process a message with second agent (has context from first agent)
  console.log('\n=== Processing with Claude Agent 2 (with context) ===');
  const response2 = await agent2.process('Can you expand on that?');
  console.log('Response:', response2.content);

  // Share knowledge between agents
  console.log('\n=== Sharing Knowledge ===');
  await agent1.shareKnowledge(
    'The user is learning TypeScript and wants detailed explanations',
    ['claude_agent_2']
  );

  // Process another message with context
  console.log('\n=== Processing with Context ===');
  const response3 = await agent2.process('Give me a practical example');
  console.log('Response:', response3.content);
}

main().catch(console.error);
