---
name: test-driven-development
description: Use this skill when adding or changing workflow schema, validation, exporters, or behavior that can be protected with tests.
---

# Test Driven Development

- Add unit tests for pure workflow logic such as schema validation, DAG checks, sorting, and export output.
- Prefer deterministic tests that do not require network; add Playwright UI automation when app behavior changes need real browser coverage.
- Run the narrowest relevant test first, then broader checks before handoff.
- For visible web application changes, run `npm run test:e2e` to exercise the Vite app with Playwright.
- Treat failing checks as implementation feedback, not as final output.
