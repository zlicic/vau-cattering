# 01 — Testing infrastructure

**What to build:** `bun run test` executes a passing test suite. Vitest + React Testing Library + jsdom configured in the Astro project. A reusable menu fixture provides sample data for component tests.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` installed and configured
- [ ] `bun run test` executes without errors
- [ ] At least one trivial passing test proves the setup works
- [ ] Menu fixture data extracted for reuse across component tests
