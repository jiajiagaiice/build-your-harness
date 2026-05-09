# Agent Instructions

When developing this repository, prefer the project-local `development-superpowers` harness:

1. Confirm the relevant workflow in `harnesses/development-superpowers/workflow.json`.
2. Load only the `skills/development-superpowers/*/SKILL.md` files needed for the current phase.
3. Follow the workflow order unless the user explicitly requests a narrower task.
4. Validate graph/schema changes with `npm test` and application changes with `npm run build`.

Keep generated skill content concise and use progressive disclosure: put essential activation guidance in `SKILL.md`, detailed references in `references/`, and deterministic helpers in `scripts/`.
