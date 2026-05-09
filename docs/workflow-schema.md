# Workflow Schema

A Build Your Harness workflow is a directed acyclic graph of skill-oriented nodes. The visual editor stores the same structure that the exporter validates and packages for an agent.

## Workflow

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | Stable workflow identifier. |
| `name` | string | yes | Human-readable workflow name. |
| `version` | string | yes | Workflow schema/content version. |
| `description` | string | no | Human-readable intent and usage guidance. |
| `entryNodeId` | string | yes | Node where the agent should start. |
| `nodes` | array | yes | Skill, gate, state, verification, or approval nodes. |
| `edges` | array | yes | Directed links between nodes. |

## Node

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | Unique node identifier inside the workflow. |
| `type` | enum | yes | One of `skill`, `gate`, `state`, `verification`, `human-approval`. |
| `label` | string | yes | Display name in the visual canvas. |
| `skillRef` | string | no | Path or registry reference for a `SKILL.md` file. |
| `description` | string | no | Node-level guidance shown in the canvas and export. |
| `skillContent` | string | no | Editable SKILL.md content authored in the visual editor and exported as a generated skill artifact. |
| `inputs` | object | no | Optional parameter metadata. |
| `outputs` | object | no | Optional output metadata. |

## Edge

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | Unique edge identifier. |
| `source` | string | yes | Source node id. |
| `target` | string | yes | Target node id. |
| `condition` | string | no | Optional branch condition. |

## Validation rules

- `entryNodeId` must match an existing node.
- Every edge `source` and `target` must match existing nodes.
- The graph must be acyclic so an agent can compute a stable execution order.

## Example

```json
{
  "id": "feature-dev",
  "name": "Feature Development",
  "version": "0.1.0",
  "entryNodeId": "brainstorming",
  "nodes": [
    {
      "id": "brainstorming",
      "type": "skill",
      "label": "Brainstorming",
      "skillRef": "skills/brainstorming/SKILL.md"
    },
    {
      "id": "implementation",
      "type": "skill",
      "label": "Implementation",
      "skillRef": "skills/implementation/SKILL.md"
    },
    {
      "id": "verification",
      "type": "verification",
      "label": "Verification",
      "skillRef": "skills/verification/SKILL.md"
    }
  ],
  "edges": [
    { "id": "brainstorming-implementation", "source": "brainstorming", "target": "implementation" },
    { "id": "implementation-verification", "source": "implementation", "target": "verification" }
  ]
}
```
