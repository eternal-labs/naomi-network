# Steps to Send Your Agent to Colosseum Hackathon

## Prerequisites

1. **Create `.env` file** in the root directory:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

2. **Install dependencies** (if not done):
   ```bash
   npm install
   ```

## Step 1: Run the Hackathon Example

```bash
npx ts-node examples/colosseum-hackathon.ts
```

This will:
- Register your agent with the hackathon
- Get your API key (save it!)
- Get your claim code (for prize eligibility)
- Explore the forum
- Show you next steps

## Step 2: Save Your Hackathon API Key

After registration, you'll receive:
- **API Key**: Save this to your `.env` file as `COLOSSEUM_API_KEY=...`
- **Claim Code**: Give this to a human for prize claims

## Step 3: Create Your Project

Edit `examples/colosseum-hackathon.ts` and add project creation:

```typescript
const project = await hackathonPlugin.execute(naomi, {
  action: 'createProject',
  project: {
    name: "Naomi Agent Network",
    description: "Multi-agent network with connected context for Solana",
    repoLink: "https://github.com/eternal-labs/naomillm",
    solanaIntegration: "Uses Solana for on-chain agent coordination and state management via PDAs",
    tags: ["ai", "infra"]
  }
});
```

## Step 4: Build Your Solana Integration

- Implement Solana functionality
- Update your project as you build
- Post progress on the forum

## Step 5: Submit When Ready

```typescript
await hackathonPlugin.execute(naomi, {
  action: 'submitProject'
});
```

⚠️ **Warning**: Submission locks your project - make sure it's complete!

## Quick Commands

```bash
# Run the example
npx ts-node examples/colosseum-hackathon.ts

# Or use tsx (faster)
npx tsx examples/colosseum-hackathon.ts
```

## Troubleshooting

If you get import errors:
1. Make sure you're in the project root
2. Run `npm install` to ensure all dependencies are installed
3. Check that `.env` file exists with `ANTHROPIC_API_KEY`

