# Contributing to Virtuals Dashboard

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/virtuals-dashboard.git
   cd virtuals-dashboard
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally
```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Test production build
npm run test         # Run unit tests
npm run test:coverage # Check test coverage
npx playwright test  # Run E2E tests
```

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (run `npm run format` if available)
- **Linting**: ESLint (run `npm run lint`)
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format
```
<type>(<scope>): <subject>

<body>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `perf`: Performance improvements
- `chore`: Build process or tooling changes

**Examples**:
```
feat(charts): add pie chart for category distribution
fix(api): handle rate limit errors gracefully
docs(readme): update installation instructions
test(ranking): add tests for sorting logic
```

## Pull Request Process

1. **Update tests**: Add/update unit or E2E tests for your changes
2. **Run the test suite**: Ensure all tests pass
3. **Update documentation**: If you change APIs or add features
4. **Check coverage**: Aim to maintain >85% coverage
5. **Create PR**: Use a clear title and description

### PR Checklist
- [ ] Tests pass locally (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] E2E tests pass (`npx playwright test`)
- [ ] Code follows project conventions
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention

## Testing Guidelines

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from "vitest";

describe("ComponentName", () => {
  it("should render correctly", () => {
    // Test implementation
  });
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from "@playwright/test";

test("feature works correctly", async ({ page }) => {
  await page.goto("/");
  // Test interactions
});
```

## Project Structure

```
src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
├── lib/           # Utilities, contexts, API clients
└── e2e/           # Playwright E2E tests
```

## Adding Features

### New Component
1. Create component in `src/components/`
2. Add corresponding test file (e.g., `Component.test.tsx`)
3. Export from component file
4. Update documentation if needed

### New API Route
1. Create route in `src/app/api/[name]/route.ts`
2. Add rate limiting if needed
3. Document endpoint in README

### New Page
1. Create in `src/app/[page]/page.tsx`
2. Add loading state (`loading.tsx`)
3. Add metadata/SEO tags
4. Update sitemap if dynamic

## Internationalization (i18n)

Add translations to `src/lib/i18n.ts`:
```typescript
const messages = {
  ko: { "key": "한국어 텍스트" },
  en: { "key": "English text" },
};
```

## Accessibility (a11y)

- Use semantic HTML
- Add `aria-label` for icon buttons
- Ensure keyboard navigation works
- Test with screen reader if possible

## Performance

- Use `next/image` for images
- Lazy load components when appropriate
- Check bundle size after changes
- Test on slow 3G network

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and constructive

## Code of Conduct

- Be welcoming and inclusive
- Respect differing viewpoints
- Accept constructive criticism
- Focus on what's best for the community

---

**Happy coding! 🚀**
