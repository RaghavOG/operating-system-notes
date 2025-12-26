# Contributing to Operating Systems Notes

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/operating-system-notes.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

## Development Guidelines

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Run `npm run lint` before committing
- Use `npm run format` to format code

### Commit Messages

- Use clear, descriptive commit messages
- Follow conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `style:` for formatting changes
  - `refactor:` for code refactoring
  - `test:` for adding tests
  - `chore:` for maintenance tasks

### Pull Request Process

1. Ensure your code passes linting: `npm run lint`
2. Ensure TypeScript compiles: `npm run type-check`
3. Update documentation if needed
4. Create a pull request with a clear description
5. Wait for review and address feedback

## Adding Content

### Content Structure

- Add markdown files to the `/content` directory
- Follow the existing topic structure (`topic-XX-name/`)
- Use descriptive filenames with numbers for ordering

### Markdown Guidelines

- Use proper heading hierarchy (H1 → H2 → H3)
- Include frontmatter with title and description
- Use code blocks with language specification
- Add examples where relevant
- Keep content focused and concise

### Frontmatter Example

```yaml
---
title: "Your Title"
description: "Brief description"
---
```

## Reporting Issues

When reporting issues, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information (if relevant)
- Screenshots (if applicable)

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🎉

