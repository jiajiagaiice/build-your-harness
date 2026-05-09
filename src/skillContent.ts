import { SkillNode } from './schema/workflow';

export function createSkillDraft(node: SkillNode): string {
  const slug = slugify(node.label || node.id);
  const description = node.description?.trim() || `Use this skill when the workflow reaches the ${node.label} phase.`;

  return `---
name: ${slug}
description: ${description}
---

# ${node.label}

## When to use

Use this skill when this harness reaches the \`${node.id}\` node.

## Instructions

1. Confirm the current user goal and constraints.
2. Apply the ${node.type} guidance for this workflow step.
3. Keep outputs concise, actionable, and easy to verify.
4. State completion status and any follow-up needed before moving on.
`;
}

export function createSkillGenerationPrompt(node: SkillNode): string {
  return `Generate concise SKILL.md content for this AI-agent harness node.

Node id: ${node.id}
Label: ${node.label}
Type: ${node.type}
Skill reference: ${node.skillRef || 'not set'}
Description: ${node.description || 'not set'}

Requirements:
- Return only valid Markdown for SKILL.md.
- Include YAML frontmatter with name and description.
- Keep activation guidance short.
- Put detailed background in references/ only if truly needed.
- Include deterministic steps the agent should follow.`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'generated-skill';
}
