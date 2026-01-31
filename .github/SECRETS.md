# GitHub Secrets Configuration

This document explains how to configure the Anthropic API key for the Naomi Agent Network when using GitHub.

## Required Secret

Naomi uses Claude (Anthropic) exclusively. You need to add the Anthropic API key as a secret to your GitHub repository.

### Adding Secret to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

#### For Claude (Anthropic)
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: Your Anthropic API key (starts with `sk-ant-...`)

## Using Secrets in GitHub Actions

Secrets are automatically available in GitHub Actions workflows as environment variables:

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Local Development

For local development, create a `.env` file in the root directory:

```env
ANTHROPIC_API_KEY=your_key_here
```

**Important**: Never commit `.env` files to the repository. They are already in `.gitignore`.

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (you'll only see it once!)
6. Add it to your `.env` file or GitHub Secrets

## Security Best Practices

- ✅ Use GitHub Secrets for CI/CD
- ✅ Use `.env` files for local development (not committed)
- ✅ Rotate keys regularly
- ✅ Use different keys for development and production
- ❌ Never commit API keys to the repository
- ❌ Never share keys in issues or pull requests
- ❌ Never log keys in console output

