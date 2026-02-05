# Contributing to Naomi Agent Network

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/naomi-network.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit: `git commit -m "Add your feature"`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Build packages: `npm run build`
3. Set up environment variables (see [Documentation](./DOCUMENTATION.md))

## Testing with Claude

To test with Claude (Anthropic):

1. Get an API key from https://console.anthropic.com/
2. Add to `.env`: `ANTHROPIC_API_KEY=your_key_here`
3. Run examples: `cd examples && npx ts-node with-model-provider.ts`

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Run `npm run lint` before committing

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md (if applicable)
5. Request review

## Areas for Contribution

- Plugin development
- UI improvements
- Documentation
- Bug fixes
- Performance optimizations
- Claude model optimization

## Questions?

Open an issue or start a discussion!

