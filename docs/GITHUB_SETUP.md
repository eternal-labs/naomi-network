# GitHub Setup Guide

This guide explains how to set up the Naomi Agent Network repository on GitHub with Claude (Anthropic) support.

## Initial Repository Setup

### 1. Create the Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Naomi Agent Network with Claude support"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/naomillm.git

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Secrets

To use Claude in GitHub Actions or for deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add `ANTHROPIC_API_KEY` with your Anthropic API key

See [.github/SECRETS.md](../.github/SECRETS.md) for detailed instructions.

### 3. Enable GitHub Actions

The repository includes GitHub Actions workflows:
- **CI**: Runs tests on push/PR
- **Test with Claude**: Optional workflow to test Claude integration

These will run automatically once secrets are configured.

## Using Claude in the Repository

### Local Development

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

3. Use Claude in your code:
```typescript
import { AgentManager, AnthropicProvider } from '@naomi/core';

const manager = new AgentManager();
const agent = await manager.createAgent({
  id: 'claude_agent',
  name: 'Claude Assistant',
  systemPrompt: 'You are Claude, a helpful AI assistant.'
});

// Set Claude as the model provider
agent.setModelProvider(new AnthropicProvider(process.env.ANTHROPIC_API_KEY!));
```

### In GitHub Actions

Secrets are automatically available as environment variables:

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Example: Creating a Claude Agent via API

```bash
# Using the CLI
naomi agent:create

# Or via API
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "id": "claude_1",
    "name": "Claude Assistant",
    "systemPrompt": "You are Claude, powered by Anthropic."
  }'
```

## Repository Structure for Claude

The Claude integration is already included:

- **Model Provider**: `packages/core/src/providers/ModelProvider.ts`
  - `AnthropicProvider` class handles Claude API calls
- **Examples**: `examples/with-model-provider.ts`
  - Shows how to use Claude with agents
- **Documentation**: This guide and others in `docs/`

## Adding Claude to README

The README already mentions Claude support. You can highlight it by:

1. Adding a "Powered by Claude" badge (optional)
2. Including Claude in the feature list (already done)
3. Adding Claude-specific examples

## Troubleshooting

### Claude API Key Not Working

1. Verify the key is correct (starts with `sk-ant-`)
2. Check your Anthropic account has API access enabled
3. Ensure the key has sufficient credits/quota
4. Check network connectivity

### GitHub Actions Failing

1. Verify secrets are set correctly in repository settings
2. Check workflow logs for specific error messages
3. Ensure Node.js version matches (18+)
4. Verify all dependencies are installed

### Local Development Issues

1. Ensure `.env` file exists and has `ANTHROPIC_API_KEY`
2. Restart the server after changing `.env`
3. Check API key has proper permissions
4. Verify network/firewall allows API calls

## Next Steps

- Read [Getting Started Guide](./GETTING_STARTED.md)
- Check [Architecture Documentation](../ARCHITECTURE.md)
- Explore [Examples](../examples/)

