# Naomi Agent Network

**A Multi-Agent Network with Connected Context**

Naomi is an open-source framework for building and deploying AI agent networks where agents can share context and collaborate intelligently.

## ✨ Key Features

* 🤖 **Multi-Agent Architecture**: Create networks of specialized agents that work together
* 🔗 **Connected Context**: Agents share context and knowledge across the network
* 🧠 **Powered by Claude**: Built exclusively with Anthropic's Claude models
* 🔌 **Extensible Plugins**: Build custom functionality with a powerful plugin system
* 🖥️ **Web Dashboard**: Modern UI for managing agents and monitoring context flow
* 📡 **Real-time Communication**: Agents communicate and share context in real-time
* 📄 **Document Ingestion**: RAG capabilities for knowledge retrieval

> 💡 **Claude Support**: Full integration with Anthropic's Claude models. See [Quick Start: Claude](./QUICK_START_CLAUDE.md) for setup.

## 🏗️ Architecture

```
/
├── packages/
│   ├── core/           # Core agent framework and context network
│   ├── server/         # Express.js backend server
│   ├── client/         # React web interface
│   ├── cli/            # Command-line tool
│   └── plugins/        # Plugin system and examples
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd naomillm

# Install dependencies
npm install

# Build all packages
npm run build
```

### Configuration

Create a `.env` file in the root:

```env
ANTHROPIC_API_KEY=your_claude_key_here
PORT=3000
```

### Start the Server

```bash
cd packages/server
npm run dev
```

The API server will run on `http://localhost:3000`

### Start the Web UI

In a new terminal:

```bash
cd packages/client
npm run dev
```

Visit `http://localhost:3001` to access the web dashboard.

### Using the CLI

```bash
cd packages/cli
npm run build

# List agents
naomi agent:list

# Create an agent
naomi agent:create

# Process a message
naomi agent:process -a agent_1 -m "Hello!"

# View network
naomi network:topology
```

## 📚 Documentation

- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [GitHub Setup Guide](./docs/GITHUB_SETUP.md) - Setting up Claude on GitHub
- [Architecture Overview](./ARCHITECTURE.md)
- [Examples](./examples/)

## 🔑 API Keys & GitHub Setup

### For Local Development

Create a `.env` file:
```env
ANTHROPIC_API_KEY=your_claude_key_here
```

### For GitHub

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add `ANTHROPIC_API_KEY` as a repository secret
3. See [GitHub Setup Guide](./docs/GITHUB_SETUP.md) for details

**Note**: Never commit API keys to the repository. Use GitHub Secrets for CI/CD.

## 💡 Key Concepts

### Context Network

Agents share context through a **ContextNetwork**:
- Messages are automatically shared with connected agents
- Knowledge can be explicitly shared
- Context history is maintained per agent
- Global context pool for cross-agent knowledge

### Agent Connections

Agents can be connected in any topology:
- Direct connections for immediate context sharing
- Selective sharing to specific agents
- Transitive context flow through the network

### Plugin System

Extend agent capabilities with plugins:
- Memory storage
- Document retrieval (RAG)
- External tool integration
- Custom functionality

See `packages/core/src/plugins/examples/` for plugin examples.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📜 License

MIT

