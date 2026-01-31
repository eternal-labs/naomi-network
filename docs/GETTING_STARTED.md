# Getting Started with Naomi

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd naomillm
```

2. Install dependencies:
```bash
npm install
```

3. Build all packages:
```bash
npm run build
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Anthropic API key to `.env`:
```env
ANTHROPIC_API_KEY=your_claude_key_here
```

**Note**: You need an Anthropic API key to use Claude. Get one at https://console.anthropic.com/

## Running the Server

Start the development server:
```bash
cd packages/server
npm run dev
```

The server will run on `http://localhost:3000`

## Running the Web UI

In a new terminal:
```bash
cd packages/client
npm run dev
```

The web UI will be available at `http://localhost:3001`

## Using the CLI

Build the CLI first:
```bash
cd packages/cli
npm run build
```

Then use it:
```bash
# List agents
naomi agent:list

# Create an agent
naomi agent:create

# Process a message
naomi agent:process -a agent_1 -m "Hello!"

# View network topology
naomi network:topology

# Connect agents
naomi network:connect -a1 agent_1 -a2 agent_2

# View context
naomi context:view -a agent_1
```

## Creating Agents Programmatically

See `examples/basic-usage.ts` for a complete example.

## Architecture

- **Core**: Agent framework and context network
- **Server**: Express.js API server
- **Client**: React web interface
- **CLI**: Command-line tool

## Next Steps

- Read the [API Documentation](./API.md)
- Check out [Plugin Development](./PLUGINS.md)
- See [Examples](../examples/)

