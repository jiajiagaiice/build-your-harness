import { SkillNode } from './schema/workflow';

export type SkillMetadataUpdate = Pick<SkillNode, 'label' | 'description'>;

export function createSkillDraft(node?: Partial<SkillNode>): string {
  const label = node?.label?.trim() || 'My Skill';
  const slug = slugify(label || node?.id || 'my-skill');
  const description = node?.description?.trim() || 'Use this skill when the harness needs focused, reusable guidance.';

  return `---
name: ${slug}
description: ${description}
---

# ${label}

## When to use

Use this skill when the current workflow step matches this capability.

## Instructions

1. Confirm the user goal and constraints.
2. Apply the guidance for this step.
3. Keep the output concise and verifiable.
`;
}

export function readSkillMetadataFromContent(content: string): Partial<SkillMetadataUpdate> {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
  const metadata: Partial<SkillMetadataUpdate> = {};

  if (frontmatter) {
    const name = readFrontmatterField(frontmatter[1], 'name');
    const description = readFrontmatterField(frontmatter[1], 'description');

    if (name) {
      metadata.label = titleize(name);
    }
    if (description) {
      metadata.description = description;
    }
  }

  if (!metadata.label) {
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (heading) {
      metadata.label = heading;
    }
  }

  return metadata;
}

export function readSkillMetadataFromReference(reference: string): Partial<SkillMetadataUpdate> {
  const cleanReference = reference.trim().replace(/[?#].*$/, '').replace(/\/+$/, '');
  if (!cleanReference) {
    return {};
  }

  const parts = cleanReference.split('/').filter(Boolean);
  const last = parts.at(-1)?.toLowerCase() === 'skill.md' ? parts.at(-2) : parts.at(-1);

  return last ? { label: titleize(last.replace(/\.md$/i, '')) } : {};
}

function readFrontmatterField(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'im'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '');
}

function titleize(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'My Skill';
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'my-skill'
  );
}
