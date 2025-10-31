# Contributing to Facebook Marketplace Watcher

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help maintain a positive environment

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Chrome version
   - Extension version
   - Relevant logs from Logs tab

### Suggesting Features

1. Check if feature was already suggested
2. Create an issue describing:
   - Use case
   - Expected behavior
   - Potential implementation

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with clear description

## Development Setup

### Prerequisites

- Node.js 14+
- npm
- Chrome browser

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/fb-watcher.git
cd fb-watcher

# Install dependencies
npm install

# Build extension
npm run build

# Or run in watch mode
npm run dev
```

### Project Structure

```
src/
├── background/       # Service worker
├── content/          # Content scripts
├── dashboard/        # React UI
└── utils/           # Shared utilities
```

### Development Workflow

1. Make changes in `src/`
2. Run `npm run build` or `npm run dev`
3. Reload extension in Chrome
4. Test changes
5. Run `npm run lint` before commit

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow existing code style
- Add comments for complex logic
- Keep functions small and focused

### Components

- Use functional components
- Keep components focused
- Extract reusable components
- Use meaningful prop names

### Naming Conventions

- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case or PascalCase for components

### Git Commits

- Use clear, descriptive messages
- Start with verb (Add, Fix, Update, etc.)
- Reference issues when applicable

Examples:
```
Add semantic keyword matching
Fix notification sending on Firefox
Update README with new features
```

## Testing

### Manual Testing

1. Test all tabs (Dashboard, Settings, Logs)
2. Test notifications (Browser, Telegram, Discord)
3. Test manual and automatic scans
4. Test with different settings
5. Check console for errors

### Test Checklist

- [ ] Extension loads without errors
- [ ] Dashboard displays correctly
- [ ] Settings save and persist
- [ ] Keywords can be added/removed
- [ ] Manual scan works
- [ ] Notifications send correctly
- [ ] Logs display activity
- [ ] Sleep hours work
- [ ] No console errors

## Documentation

- Update README.md for user-facing changes
- Update USAGE.md for new features
- Add JSDoc comments for complex functions
- Update INSTALL.md for setup changes

## Release Process

1. Update version in package.json and manifest.json
2. Update CHANGELOG.md
3. Create release tag
4. Build production bundle
5. Create GitHub release

## Need Help?

- Check existing issues and PRs
- Ask questions in issues
- Read the documentation
- Review existing code

## Recognition

Contributors will be recognized in:
- README.md
- Release notes
- Git commit history

Thank you for contributing!
