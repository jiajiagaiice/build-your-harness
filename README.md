# Build Your Harness

Build Your Harness is a visual composer for AI agent skill harness workflows. It lets users arrange reusable skills as directed nodes, connect them with arrows that express execution order, validate the graph, and export a harness package that an AI agent can follow.

## Product goal

The project is designed around a simple model:

- **Skill nodes** represent reusable agent capabilities such as brainstorming, planning, implementation, verification, or human approval.
- **Directed edges** represent workflow order and optional conditions.
- **Harness workflows** package a directed acyclic graph, skill metadata, and agent-facing instructions so the same process can be reused reliably.

## Why harness engineering?

Harness engineering treats the agent's environment as a product surface: prompts, skills, tools, context, state checkpoints, validation loops, and review gates all become explicit infrastructure. This project turns that infrastructure into a visual graph that users can author and export.

## Current MVP

- React + TypeScript + Vite application shell.
- React Flow canvas for arranging skill nodes and directed edges.
- Workflow schema and DAG validation with Zod.
- Local skill registry seeded with a Superpowers-inspired development workflow.
- Exporter that converts a workflow into agent-facing harness artifacts.
- Project-local development harness under `harnesses/development-superpowers/`.

## Quick start

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run build
npm test
npm run lint
```

## Repository layout

```text
src/
  app/                 React app shell and visual composer UI
  components/          Reusable UI components
  exporters/           Workflow-to-harness artifact generation
  registry/            Local skill registry metadata
  schema/              Workflow schema and DAG validation
  store/               Client-side workflow state
skills/                Local reusable skill definitions
harnesses/             Example and project-local harness workflows
docs/                  Design notes and schema documentation
```

## Default development harness

The project includes `development-superpowers`, a Superpowers-inspired linear workflow used as the default harness for developing this repository:

```text
using-superpowers → brainstorming → writing-plans → executing-plans → test-driven-development → requesting-code-review → verification-before-completion
```

See `harnesses/development-superpowers/workflow.json` for the graph and `skills/development-superpowers/` for the agent-facing skill instructions.
