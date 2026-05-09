# Research Summary

## Harness engineering

Harness engineering is the practice of making an AI agent's operating environment explicit: skills, prompts, tools, context, memory, state, review gates, and verification loops become designed infrastructure rather than ad hoc prompt text.

## Projects reviewed

- `obra/superpowers`: best reference for composable development skills and a default repository development harness.
- `superpowers-mcp`: useful reference for future skill discovery, recommendation, workflow composition, and validation APIs.
- `get-shit-done`: useful reference for state files, resume flows, and context management around long-running work.
- `HKUDS/OpenHarness`: useful reference for a broader runtime with tools, skills, commands, and multi-agent features.

## Visual orchestration decision

The MVP uses React Flow because it directly matches the product model: skill nodes connected by directed edges. Rete.js remains a good candidate if the product later needs typed ports, dataflow execution, or code generation. Flowise is useful as a product-shape reference, but its LangChain/RAG node model is not the right core abstraction for this project.
