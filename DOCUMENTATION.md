# Naomi Documentation

**Build AI Agent Networks That Actually Work**

Naomi is an open-source TypeScript framework for building and deploying AI agent networks where agents can share context, collaborate intelligently, and work together autonomously. Built exclusively with Anthropic's Claude models.

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [Agent Configuration](#agent-configuration)
- [Context Network](#context-network)
- [Model Providers](#model-providers)
- [Plugin System](#plugin-system)
- [API Reference](#api-reference)
- [CLI Reference](#cli-reference)
- [Examples](#examples)
- [Colosseum Hackathon Integration](#colosseum-hackathon-integration)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Contributing](#contributing)

---

## Overview

### What is Naomi?

Naomi is a multi-agent network framework that enables you to:

- **Create Networks of AI Agents**: Build specialized agents that work together
- **Share Context Automatically**: Agents automatically share context and knowledge across the network
- **Extend with Plugins**: Add custom functionality through a powerful plugin system
- **Deploy Anywhere**: Run locally, in Docker, or on your own infrastructure
- **Participate in Hackathons**: Built-in Colosseum Agent Hackathon integration

### Key Features

- 🤖 **Multi-Agent Architecture**: Create networks of specialized agents
- 🔗 **Connected Context**: Agents share context and knowledge automatically
- 🧠 **Powered by Claude**: Built exclusively with Anthropic's Claude models
- 🔌 **Extensible Plugins**: Build custom functionality with plugins
- 🏆 **Hackathon Ready**: Built-in Colosseum Agent Hackathon integration ($100k prize pool)
- 🖥️ **Web Dashboard**: Modern UI for managing agents and monitoring context flow
- 📡 **Real-time Communication**: Agents communicate via WebSocket
- 📄 **Document Ingestion**: RAG capabilities for knowledge retrieval

### Why Naomi?

**Ship Fast** — Three commands to a live agent network. No boilerplate, no config hell.

**Scale Freely** — Start with a single agent. Scale to complex multi-agent networks.

**Truly Open** — Every line is open source. Extend through plugins, contribute to core, build the future together.

---

## Quick Start

### Three Commands to Get Started

```bash
# 1. Install dependencies
npm install

# 2. Build all packages
npm run build

# 3. Start the server
cd packages/server && npm run dev
```

### Your First Agent

```typescript
import { AgentManager } from '@naomi/core';
import { AnthropicProvider } from '@naomi/core';
import * as dotenv from 'dotenv';

dotenv.config();

const manager = new AgentManager();
const apiKey = process.env.ANTHROPIC_API_KEY!;

// Create an agent
const agent = await manager.createAgent({
  id: 'my-agent',
  name: 'My Agent',
  systemPrompt: 'You are a helpful AI assistant.'
});

// Set Claude as the model provider
agent.setModelProvider(new AnthropicProvider(apiKey));

// Process a message
const response = await agent.process('Hello!');
console.log(response.content);
```

---

## Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Install Naomi

```bash
# Clone the repository
git clone https://github.com/eternal-labs/naomi-network.git
cd naomi-network

# Install dependencies
npm install

# Build all packages
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Anthropic API Key
ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional: Server Configuration
PORT=3000

# Optional: Colosseum Hackathon
COLOSSEUM_API_KEY=your_colosseum_api_key_here
COLOSSEUM_CLAIM_CODE=your_claim_code_here
```

**⚠️ Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

---

## Core Concepts

### Agents

An **Agent** is an autonomous AI entity that can:
- Process messages and generate responses
- Share context with other agents
- Execute plugins for extended functionality
- Maintain its own state and memory

### Context Network

The **Context Network** is the core innovation of Naomi. It enables:
- **Automatic Context Sharing**: Messages are automatically shared with connected agents
- **Context History**: Each agent maintains its own context history
- **Global Context Pool**: System-wide context for cross-agent knowledge
- **Selective Sharing**: Target specific agents when sharing knowledge

### Model Providers

**Model Providers** abstract LLM interactions. Naomi currently supports:
- **AnthropicProvider**: Claude models (Opus, Sonnet, Haiku)

### Plugins

**Plugins** extend agent capabilities:
- Memory storage and retrieval
- Document ingestion (RAG)
- External API integration
- Custom functionality

---

## Agent Configuration

### AgentConfig Interface

```typescript
interface AgentConfig {
  id: string;                    // Unique agent identifier
  name: string;                   // Human-readable name
  description?: string;           // Agent description
  model?: string;                 // Model name (default: claude-3-sonnet-20240229)
  apiKey?: string;                // Optional per-agent API key
  temperature?: number;           // 0.0-1.0 (default: 0.7)
  maxTokens?: number;             // Max tokens per response (default: 1000)
  systemPrompt?: string;          // System prompt for the agent
  capabilities?: string[];        // List of capabilities
  plugins?: string[];             // List of plugin names to load
}
```

### Creating an Agent

```typescript
const agent = await manager.createAgent({
  id: 'analyst-agent',
  name: 'Market Analyst',
  description: 'Analyzes market trends and patterns',
  systemPrompt: 'You are a financial market analyst with expertise in DeFi and trading.',
  temperature: 0.3,  // Lower temperature for more focused analysis
  maxTokens: 2000,
  capabilities: ['market-analysis', 'data-interpretation']
});
```

### Agent State

Each agent maintains a state object:

```typescript
interface AgentState {
  id: string;
  config: AgentConfig;
  network: {
    agentId: string;
    connectedAgents: string[];
    sharedContext: ContextMessage[];
    contextHistory: ContextMessage[];
  };
  isActive: boolean;
  lastActivity: number;
}
```

---

## Context Network

### How Context Sharing Works

1. **Agent Processes Message**: When an agent processes a message, it creates a context message
2. **Context Created**: The context message includes the input, response, and metadata
3. **Automatic Sharing**: The context is automatically shared with all connected agents
4. **Context Available**: Connected agents can use this context in future processing

### Context Types

```typescript
type ContextType = 'message' | 'knowledge' | 'state' | 'event';
```

- **message**: Regular conversation messages
- **knowledge**: Shared knowledge/facts
- **state**: Agent state updates
- **event**: System events

### Connecting Agents

```typescript
// Connect two agents
manager.connectAgents('agent-1', 'agent-2');

// Agents can now share context automatically
```

### Sharing Knowledge Explicitly

```typescript
// Share knowledge with all connected agents
await agent.shareKnowledge('Bitcoin price is $50,000');

// Share knowledge with specific agents
await agent.shareKnowledge(
  'Important market data',
  ['agent-2', 'agent-3']
);
```

### Context Network API

```typescript
// Get context for an agent
const context = contextNetwork.getAgentContext('agent-1', 50); // Last 50 messages

// Get shared context between agents
const shared = contextNetwork.getSharedContext(['agent-1', 'agent-2'], 100);

// Get network topology
const topology = contextNetwork.getNetworkTopology();

// Clear agent context
contextNetwork.clearAgentContext('agent-1');
```

---

## Model Providers

### AnthropicProvider

The `AnthropicProvider` integrates with Anthropic's Claude API.

```typescript
import { AnthropicProvider } from '@naomi/core';

const provider = new AnthropicProvider(
  process.env.ANTHROPIC_API_KEY!,
  'https://api.anthropic.com/v1'  // Optional: custom base URL
);

agent.setModelProvider(provider);
```

### Supported Models

- `claude-3-opus-20240229` - Most capable model
- `claude-3-sonnet-20240229` - Balanced performance (default)
- `claude-3-haiku-20240307` - Fastest and most cost-effective

### Model Options

```typescript
const response = await agent.process('Hello', {
  model: 'claude-3-sonnet-20240229',
  temperature: 0.7,
  maxTokens: 1000
});
```

### Custom Model Provider

You can create custom model providers by implementing the `ModelProvider` interface:

```typescript
interface ModelProvider {
  name: string;
  generate: (prompt: string, options?: any) => Promise<string>;
  stream?: (prompt: string, options?: any) => AsyncGenerator<string>;
}
```

---

## Plugin System

### Plugin Architecture

Plugins extend agent capabilities through a simple interface:

```typescript
interface Plugin {
  name: string;
  version: string;
  initialize: (agent: Agent) => Promise<void>;
  execute: (agent: Agent, input: any) => Promise<any>;
  cleanup?: () => Promise<void>;
}
```

### BasePlugin Class

Extend `BasePlugin` to create your own plugins:

```typescript
import { BasePlugin } from '@naomi/core';
import { Agent } from '@naomi/core';

export class MyPlugin extends BasePlugin {
  name = 'my-plugin';
  version = '1.0.0';

  async initialize(agent: Agent): Promise<void> {
    // Initialize plugin resources
  }

  async execute(agent: Agent, input: any): Promise<any> {
    // Execute plugin functionality
    return { result: 'success' };
  }

  async cleanup(): Promise<void> {
    // Cleanup resources
  }
}
```

### Using Plugins

```typescript
// Register a plugin
const plugin = new MyPlugin();
agent.registerPlugin(plugin);

// Execute plugin
const result = await plugin.execute(agent, { action: 'doSomething' });
```

### Built-in Plugins

#### ColosseumHackathonPlugin

Enables agents to participate in the Colosseum Agent Hackathon.

```typescript
import { ColosseumHackathonPlugin } from '@naomi/core';

const hackathonPlugin = new ColosseumHackathonPlugin();
hackathonPlugin.setApiKey(process.env.COLOSSEUM_API_KEY!);
agent.registerPlugin(hackathonPlugin);

// Register agent
await hackathonPlugin.execute(agent, {
  action: 'register',
  name: 'My Agent'
});

// Create project
await hackathonPlugin.execute(agent, {
  action: 'createProject',
  project: {
    name: 'My Project',
    description: 'Project description',
    tags: ['ai', 'trading', 'defi']
  }
});
```

#### MemoryPlugin

Example memory plugin for storing and retrieving memories.

See `packages/core/src/plugins/examples/MemoryPlugin.ts` for implementation.

### Plugin Events

Plugins can emit events that agents can listen to:

```typescript
agent.on('plugin:initialized', (pluginName) => {
  console.log(`Plugin ${pluginName} initialized`);
});

agent.on('plugin:error', ({ name, error }) => {
  console.error(`Plugin ${name} error:`, error);
});
```

---

## API Reference

### REST API

The Naomi server exposes a REST API for managing agents and the network.

#### Base URL

```
http://localhost:3000/api
```

### Agent Endpoints

#### List All Agents

```http
GET /api/agents
```

**Response:**
```json
{
  "agents": [
    {
      "id": "agent-1",
      "config": { ... },
      "network": { ... },
      "isActive": true,
      "lastActivity": 1234567890
    }
  ]
}
```

#### Get Agent by ID

```http
GET /api/agents/:id
```

**Response:**
```json
{
  "agent": {
    "id": "agent-1",
    "config": { ... },
    "network": { ... },
    "isActive": true,
    "lastActivity": 1234567890
  }
}
```

#### Create Agent

```http
POST /api/agents
Content-Type: application/json

{
  "id": "agent-1",
  "name": "My Agent",
  "systemPrompt": "You are a helpful assistant.",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

**Response:**
```json
{
  "agent": {
    "id": "agent-1",
    "config": { ... },
    "network": { ... },
    "isActive": false,
    "lastActivity": 1234567890
  }
}
```

#### Update Agent

```http
PUT /api/agents/:id
Content-Type: application/json

{
  "temperature": 0.5,
  "maxTokens": 2000
}
```

#### Delete Agent

```http
DELETE /api/agents/:id
```

**Response:**
```json
{
  "success": true
}
```

#### Process Message

```http
POST /api/agents/:id/process
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "metadata": {
    "source": "user",
    "timestamp": 1234567890
  }
}
```

**Response:**
```json
{
  "response": {
    "content": "Hello! I'm doing well, thank you for asking.",
    "contextUpdates": [
      {
        "id": "msg_1234567890_abc123",
        "agentId": "agent-1",
        "content": "Hello, how are you?",
        "timestamp": 1234567890,
        "metadata": {
          "response": "Hello! I'm doing well...",
          "source": "user"
        },
        "contextType": "message"
      }
    ],
    "metadata": { ... }
  }
}
```

#### Share Knowledge

```http
POST /api/agents/:id/knowledge
Content-Type: application/json

{
  "knowledge": "Bitcoin price is $50,000",
  "targetAgents": ["agent-2", "agent-3"],
  "metadata": {
    "source": "market-data",
    "timestamp": 1234567890
  }
}
```

**Response:**
```json
{
  "success": true
}
```

### Context Endpoints

#### Get Agent Context

```http
GET /api/context/agent/:id?limit=50
```

**Response:**
```json
{
  "context": [
    {
      "id": "msg_1234567890_abc123",
      "agentId": "agent-1",
      "content": "Hello",
      "timestamp": 1234567890,
      "metadata": { ... },
      "contextType": "message"
    }
  ]
}
```

#### Get Shared Context

```http
POST /api/context/shared
Content-Type: application/json

{
  "agentIds": ["agent-1", "agent-2"],
  "limit": 100
}
```

#### Clear Agent Context

```http
DELETE /api/context/agent/:id
```

**Response:**
```json
{
  "success": true
}
```

### Network Endpoints

#### Get Network Topology

```http
GET /api/network/topology
```

**Response:**
```json
{
  "topology": [
    {
      "agentId": "agent-1",
      "connections": ["agent-2", "agent-3"]
    },
    {
      "agentId": "agent-2",
      "connections": ["agent-1"]
    }
  ]
}
```

#### Connect Agents

```http
POST /api/network/connect
Content-Type: application/json

{
  "agentId1": "agent-1",
  "agentId2": "agent-2"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Get Registered Agents

```http
GET /api/network/agents
```

**Response:**
```json
{
  "agents": ["agent-1", "agent-2", "agent-3"]
}
```

### WebSocket Events

The server also supports WebSocket connections for real-time updates.

#### Connection

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected to Naomi server');
});
```

#### Events

- `agent:created` - New agent created
- `agent:processed` - Agent processed a message
- `agent:connected` - Agents connected
- `context:shared` - Context shared between agents
- `context:created` - New context message created

---

## CLI Reference

The Naomi CLI provides command-line tools for managing agents and the network.

### Installation

```bash
cd packages/cli
npm install
npm run build
```

### Commands

#### List Agents

```bash
naomi agent:list
```

**Output:**
```
Found 2 agent(s):

  Market Analyst (agent-1)
    Status: 🟢 Active
    Connections: 1

  Data Processor (agent-2)
    Status: 🟢 Active
    Connections: 1
```

#### Create Agent

```bash
naomi agent:create
```

Interactive prompt for creating a new agent.

#### Process Message

```bash
naomi agent:process -a agent-1 -m "Hello, how are you?"
```

**Output:**
```
Response: Hello! I'm doing well, thank you for asking.
```

#### Show Network Topology

```bash
naomi network:topology
```

**Output:**
```
Network Topology:

  agent-1
    Connected to: agent-2

  agent-2
    Connected to: agent-1
```

#### Connect Agents

```bash
naomi network:connect -a1 agent-1 -a2 agent-2
```

#### View Context

```bash
naomi context:view -a agent-1 -l 50
```

**Output:**
```
Context for agent-1 (25 messages):

[2024-01-15 10:30:00] agent-1: Hello, how are you?
  Type: message

[2024-01-15 10:29:45] agent-2: I received your message
  Type: message
```

#### Share Knowledge

```bash
naomi knowledge:share -a agent-1 -k "Bitcoin price is $50,000" -t "agent-2,agent-3"
```

### Environment Variables

The CLI uses the `NAOMI_API_URL` environment variable to determine the API endpoint:

```bash
export NAOMI_API_URL=http://localhost:3000/api
naomi agent:list
```

---

## Examples

### Basic Usage

See `examples/basic-usage.ts` for a simple example of creating agents and processing messages.

```typescript
import { AgentManager, AnthropicProvider } from '@naomi/core';
import * as dotenv from 'dotenv';

dotenv.config();

const manager = new AgentManager();
const apiKey = process.env.ANTHROPIC_API_KEY!;

// Create agents
const agent1 = await manager.createAgent({
  id: 'agent_1',
  name: 'Alice',
  systemPrompt: 'You are Alice, a friendly assistant.'
});

agent1.setModelProvider(new AnthropicProvider(apiKey));

// Connect agents
manager.connectAgents('agent_1', 'agent_2');

// Process messages
const response = await agent1.process('Hello!');
console.log(response.content);
```

### With Model Provider

See `examples/with-model-provider.ts` for examples of using different model configurations.

### Colosseum Hackathon

See `examples/colosseum-hackathon.ts` for a complete example of participating in the Colosseum Agent Hackathon.

```typescript
import { ColosseumHackathonPlugin } from '@naomi/core';

const hackathonPlugin = new ColosseumHackathonPlugin();
hackathonPlugin.setApiKey(process.env.COLOSSEUM_API_KEY!);
agent.registerPlugin(hackathonPlugin);

// Register agent
const result = await hackathonPlugin.execute(agent, {
  action: 'register',
  name: 'Naomi Network'
});

// Create project
await hackathonPlugin.execute(agent, {
  action: 'createProject',
  project: {
    name: 'Naomi Market Analyst',
    description: 'An AI agent that analyzes market trends',
    tags: ['ai', 'trading', 'defi']
  }
});
```

### Forum Posting

See `examples/forum-post.ts` for examples of creating forum posts and interacting with the Colosseum forum.

---

## Colosseum Hackathon Integration

Naomi includes built-in support for the [Colosseum Agent Hackathon](https://agents.colosseum.com/), a $100k prize pool competition for AI agents.

### Registration

```typescript
const hackathonPlugin = new ColosseumHackathonPlugin();
hackathonPlugin.setApiKey(process.env.COLOSSEUM_API_KEY!);

const result = await hackathonPlugin.execute(agent, {
  action: 'register',
  name: 'My Agent Name'
});

// Save the API key!
console.log('API Key:', result.apiKey);
console.log('Claim Code:', result.claimCode);
```

### Project Management

```typescript
// Create project
await hackathonPlugin.execute(agent, {
  action: 'createProject',
  project: {
    name: 'My Project',
    description: 'Project description',
    tags: ['ai', 'trading', 'defi']  // Max 3 tags, must be from allowed list
  }
});

// Update project
await hackathonPlugin.execute(agent, {
  action: 'updateProject',
  project: {
    description: 'Updated description'
  }
});

// Submit project
await hackathonPlugin.execute(agent, {
  action: 'submitProject'
});

// Get project status
const project = await hackathonPlugin.execute(agent, {
  action: 'getMyProject'
});
```

### Forum Interaction

```typescript
// Create forum post
await hackathonPlugin.execute(agent, {
  action: 'createForumPost',
  post: {
    title: 'My Post Title',
    body: 'Post content in markdown',
    tags: ['ideation', 'ai']  // Must be from allowed list
  }
});

// List forum posts
const posts = await hackathonPlugin.execute(agent, {
  action: 'listForumPosts',
  options: {
    sort: 'recent',
    limit: 10,
    tags: ['ai']
  }
});

// Comment on post
await hackathonPlugin.execute(agent, {
  action: 'commentOnPost',
  postId: 123,
  body: 'My comment'
});
```

### Allowed Tags

**Project Tags:**
- `ai`, `trading`, `defi`, `stablecoins`, `rwas`, `infra`, `privacy`, `consumer`, `payments`, `depin`, `governance`, `new-markets`, `security`, `identity`

**Forum Tags:**
- `team-formation`, `product-feedback`, `ideation`, `progress-update`, `defi`, `stablecoins`, `rwas`, `infra`, `privacy`, `consumer`, `payments`, `trading`, `depin`, `governance`, `new-markets`, `ai`, `security`, `identity`

### Available Actions

- `register` - Register agent with hackathon
- `getStatus` - Get agent status
- `createProject` - Create a project
- `updateProject` - Update project details
- `submitProject` - Submit project for judging
- `getMyProject` - Get current project
- `createForumPost` - Create a forum post
- `listForumPosts` - List forum posts
- `commentOnPost` - Comment on a post
- `voteOnProject` - Vote on a project
- `getLeaderboard` - Get hackathon leaderboard
- `getHeartbeat` - Get hackathon heartbeat/status

---

## Deployment

### Local Development

```bash
# Start the server
cd packages/server
npm run dev

# Start the client (in another terminal)
cd packages/client
npm run dev
```

Server runs on `http://localhost:3000`
Client runs on `http://localhost:3001`

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["node", "packages/server/dist/index.js"]
```

### Production

1. Set environment variables
2. Build all packages: `npm run build`
3. Start server: `node packages/server/dist/index.js`
4. Serve client: Use a static file server or CDN

### Environment Variables

**Required:**
- `ANTHROPIC_API_KEY` - Anthropic API key

**Optional:**
- `PORT` - Server port (default: 3000)
- `COLOSSEUM_API_KEY` - Colosseum hackathon API key
- `COLOSSEUM_CLAIM_CODE` - Colosseum claim code

---

## Architecture

### Package Structure

```
naomi-network/
├── packages/
│   ├── core/           # Core agent framework
│   │   ├── agent/      # Agent and AgentManager
│   │   ├── context/    # ContextNetwork
│   │   ├── plugins/    # Plugin system
│   │   ├── providers/  # Model providers
│   │   └── types/      # TypeScript types
│   ├── server/         # Express.js API server
│   │   ├── routes/     # API routes
│   │   └── index.ts    # Server entry point
│   ├── client/         # React web interface
│   │   ├── components/ # React components
│   │   └── App.tsx     # Main app component
│   └── cli/            # Command-line tool
│       └── index.ts    # CLI entry point
├── examples/           # Example scripts
└── package.json       # Root package.json
```

### Data Flow

```
User Input
    ↓
Agent.process()
    ↓
Model Provider (Claude API)
    ↓
Response Generated
    ↓
Context Message Created
    ↓
ContextNetwork.shareContext()
    ↓
Connected Agents receive context
    ↓
Context available for future processing
```

### Agent Lifecycle

1. **Creation**: Agent is created with configuration
2. **Initialization**: Plugins are loaded, model provider is set
3. **Processing**: Agent processes messages and generates responses
4. **Context Sharing**: Responses create context that's shared with connected agents
5. **Shutdown**: Cleanup of resources

### Network Topology

Agents can be connected in any topology:
- **Direct Connections**: Two agents directly connected
- **Transitive Context**: Context flows through connected agents
- **Selective Sharing**: Agents can target specific agents when sharing

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/eternal-labs/naomi-network.git
cd naomi-network

# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Project Structure

- **Core Package**: Agent framework, context network, plugins
- **Server Package**: REST API and WebSocket server
- **Client Package**: React web interface
- **CLI Package**: Command-line tools

### Code Style

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting (recommended)

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT

---

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/eternal-labs/naomi-network/issues)
- **Documentation**: This file and inline code documentation
- **Examples**: See the `examples/` directory

---

## Contributors

- **eternal-labs** - Project maintainer
- **Claude (Anthropic)** - AI model provider and development assistant
- **openclaw** - Contributor
- **lalalune** - Contributor
- **odilitime** - Contributor
- **azep-ninja** - Contributor
- **JoeyKhd** - Contributor
- **cpojer** - Contributor
- **mcinteerj** - Contributor
- **ngutman** - Contributor
- **mukhtharcm** - Contributor
- **joaohlisboa** - Contributor
- **zerone0x** - Contributor

---

**Built with ❤️ by the Naomi community**

