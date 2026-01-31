# Naomi Architecture

## Overview

Naomi is a multi-agent network system where AI agents can share context and collaborate. It's inspired by ElizaOS but designed specifically for connected agent networks.

## Core Components

### 1. Core Package (`@naomi/core`)

The foundation of the system:

- **Agent**: Individual AI agent with processing capabilities
- **AgentManager**: Manages all agents in the network
- **ContextNetwork**: Handles context sharing between agents
- **Plugins**: Extensible plugin system
- **Model Provider**: Claude (Anthropic) integration

### 2. Server Package (`@naomi/server`)

Express.js API server with:

- REST API endpoints for agent management
- WebSocket support for real-time updates
- Context and network management routes

### 3. Client Package (`@naomi/client`)

React-based web interface:

- Agent management dashboard
- Network topology visualization
- Context viewing and sharing
- Real-time updates via WebSocket

### 4. CLI Package (`@naomi/cli`)

Command-line tool for:

- Creating and managing agents
- Processing messages
- Viewing network topology
- Sharing knowledge

## Context Network

The core innovation is the **ContextNetwork** system:

1. **Context Messages**: Agents create context messages when processing inputs
2. **Shared Context**: Messages are shared with connected agents
3. **Context History**: Each agent maintains its own context history
4. **Global Context**: System-wide context pool for cross-agent knowledge

### Context Types

- `message`: Regular conversation messages
- `knowledge`: Shared knowledge/facts
- `state`: Agent state updates
- `event`: System events

## Agent Lifecycle

1. **Creation**: Agent is created with configuration
2. **Initialization**: Plugins are loaded, model provider is set
3. **Processing**: Agent processes messages and generates responses
4. **Context Sharing**: Responses create context that's shared with connected agents
5. **Shutdown**: Cleanup of resources

## Network Topology

Agents can be connected in any topology:

- **Direct Connections**: Two agents directly connected
- **Transitive Context**: Context flows through connected agents
- **Selective Sharing**: Agents can target specific agents when sharing

## Plugin System

Plugins extend agent capabilities:

- **BasePlugin**: Abstract base class
- **Initialize**: Called when agent starts
- **Execute**: Called to run plugin functionality
- **Cleanup**: Called when agent shuts down

Example plugins:
- Memory Plugin: Store/retrieve memories
- RAG Plugin: Document retrieval
- Tool Plugin: External tool integration

## Model Provider

Naomi uses Anthropic's Claude models exclusively:

- **AnthropicProvider**: Claude model integration
- Supports all Claude models (Opus, Sonnet, Haiku)
- Default model: `claude-3-sonnet-20240229`

The system is designed with Claude's capabilities in mind, including its excellent context handling and reasoning abilities.

## Data Flow

```
User Input
    ↓
Agent.process()
    ↓
Model Provider (generates response)
    ↓
Context Message Created
    ↓
ContextNetwork.shareContext()
    ↓
Connected Agents receive context
    ↓
Context available for future processing
```

## API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create agent
- `GET /api/agents/:id` - Get agent
- `POST /api/agents/:id/process` - Process message
- `POST /api/agents/:id/knowledge` - Share knowledge

### Context
- `GET /api/context/agent/:id` - Get agent context
- `POST /api/context/shared` - Get shared context
- `DELETE /api/context/agent/:id` - Clear context

### Network
- `GET /api/network/topology` - Get network topology
- `POST /api/network/connect` - Connect agents

## WebSocket Events

Real-time updates via WebSocket:

- `agent:created` - New agent created
- `agent:processed` - Agent processed a message
- `context:shared` - Context shared between agents
- `agents:connected` - Agents connected

## Extensibility

The system is designed to be extensible:

1. **Plugins**: Add new capabilities
2. **Custom Agents**: Extend Agent class
4. **Middleware**: Add server middleware
5. **UI Components**: Extend React components

## Future Enhancements

- Persistent storage (database integration)
- Advanced context filtering
- Agent specialization and routing
- Multi-modal support (images, audio)
- Distributed agent networks
- Agent marketplace

