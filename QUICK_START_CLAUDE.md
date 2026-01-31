# Quick Start: Using Claude with Naomi

## 1. Get Your Anthropic API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys**
4. Create a new key
5. Copy it (you'll only see it once!)

## 2. Configure Locally

Create `.env` file in the root:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## 3. Use Claude in Code

```typescript
import { AgentManager, AnthropicProvider } from '@naomi/core';

const manager = new AgentManager();
const agent = await manager.createAgent({
  id: 'claude_1',
  name: 'Claude Assistant',
  systemPrompt: 'You are Claude, a helpful AI assistant.'
});

// Set Claude as provider
agent.setModelProvider(
  new AnthropicProvider(process.env.ANTHROPIC_API_KEY!)
);

// Use it!
const response = await agent.process('Hello, Claude!');
console.log(response.content);
```

## 4. Configure for GitHub

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secret: `ANTHROPIC_API_KEY` = your key
3. Use in workflows: `${{ secrets.ANTHROPIC_API_KEY }}`

## 5. Test It

```bash
# Run the example
cd examples
npx ts-node with-model-provider.ts
```

That's it! Claude is now integrated with your Naomi agent network.

## Available Claude Models

- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced (default)
- `claude-3-haiku-20240307` - Fastest

Change model in code:
```typescript
agent.setModelProvider(
  new AnthropicProvider(apiKey)
);
// Then when processing:
await agent.process('Hello', { model: 'claude-3-opus-20240229' });
```

