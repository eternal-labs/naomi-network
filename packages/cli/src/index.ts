#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import inquirer from 'inquirer';

const program = new Command();
const API_BASE = process.env.NAOMI_API_URL || 'http://localhost:3000/api';

program
  .name('naomi')
  .description('CLI tool for managing Naomi agent network')
  .version('0.1.0');

// Agent commands
program
  .command('agent:list')
  .description('List all agents')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE}/agents`);
      const agents = response.data.agents;
      console.log(`\nFound ${agents.length} agent(s):\n`);
      agents.forEach((agent: any) => {
        console.log(`  ${agent.config.name} (${agent.id})`);
        console.log(`    Status: ${agent.isActive ? '🟢 Active' : '🔴 Inactive'}`);
        console.log(`    Connections: ${agent.network.connectedAgents.length}`);
        console.log('');
      });
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

program
  .command('agent:create')
  .description('Create a new agent')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Agent ID:',
        default: () => `agent_${Date.now()}`
      },
      {
        type: 'input',
        name: 'name',
        message: 'Agent Name:',
        required: true
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description (optional):'
      },
      {
        type: 'input',
        name: 'systemPrompt',
        message: 'System Prompt (optional):'
      }
    ]);

    try {
      const response = await axios.post(`${API_BASE}/agents`, answers);
      console.log(`\n✅ Agent created: ${response.data.agent.config.name}`);
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

program
  .command('agent:process')
  .description('Process a message with an agent')
  .requiredOption('-a, --agent <id>', 'Agent ID')
  .requiredOption('-m, --message <message>', 'Message to process')
  .action(async (options) => {
    try {
      const response = await axios.post(
        `${API_BASE}/agents/${options.agent}/process`,
        { message: options.message }
      );
      console.log(`\nResponse: ${response.data.response.content}\n`);
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

// Network commands
program
  .command('network:topology')
  .description('Show network topology')
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE}/network/topology`);
      const topology = response.data.topology;
      console.log('\nNetwork Topology:\n');
      topology.forEach((node: any) => {
        console.log(`  ${node.agentId}`);
        if (node.connections.length > 0) {
          console.log(`    Connected to: ${node.connections.join(', ')}`);
        } else {
          console.log(`    No connections`);
        }
        console.log('');
      });
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

program
  .command('network:connect')
  .description('Connect two agents')
  .requiredOption('-a1, --agent1 <id>', 'First agent ID')
  .requiredOption('-a2, --agent2 <id>', 'Second agent ID')
  .action(async (options) => {
    try {
      await axios.post(`${API_BASE}/network/connect`, {
        agentId1: options.agent1,
        agentId2: options.agent2
      });
      console.log(`\n✅ Connected ${options.agent1} and ${options.agent2}\n`);
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

// Context commands
program
  .command('context:view')
  .description('View context for an agent')
  .requiredOption('-a, --agent <id>', 'Agent ID')
  .option('-l, --limit <number>', 'Limit number of messages', '50')
  .action(async (options) => {
    try {
      const response = await axios.get(
        `${API_BASE}/context/agent/${options.agent}?limit=${options.limit}`
      );
      const context = response.data.context;
      console.log(`\nContext for ${options.agent} (${context.length} messages):\n`);
      context.slice().reverse().forEach((msg: any) => {
        const time = new Date(msg.timestamp).toLocaleString();
        console.log(`[${time}] ${msg.agentId}: ${msg.content}`);
        if (msg.contextType) {
          console.log(`  Type: ${msg.contextType}`);
        }
        console.log('');
      });
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

program
  .command('knowledge:share')
  .description('Share knowledge with agents')
  .requiredOption('-a, --agent <id>', 'Agent ID')
  .requiredOption('-k, --knowledge <text>', 'Knowledge to share')
  .option('-t, --targets <ids>', 'Target agent IDs (comma-separated)')
  .action(async (options) => {
    try {
      const targetAgents = options.targets
        ? options.targets.split(',').map((s: string) => s.trim())
        : undefined;
      
      await axios.post(`${API_BASE}/agents/${options.agent}/knowledge`, {
        knowledge: options.knowledge,
        targetAgents
      });
      console.log(`\n✅ Knowledge shared\n`);
    } catch (error: any) {
      console.error('Error:', error.response?.data?.error || error.message);
    }
  });

program.parse();


