import { describe, expect, it } from 'vitest';
import { createSkillDraft, readSkillMetadataFromContent, readSkillMetadataFromReference } from './skillContent';

const node = {
  id: 'code-review',
  type: 'verification' as const,
  label: 'Code Review',
  description: 'Review correctness before handoff.',
};

describe('skill content helpers', () => {
  it('creates a concise SKILL.md draft from node metadata', () => {
    const draft = createSkillDraft(node);

    expect(draft).toContain('name: code-review');
    expect(draft).toContain('# Code Review');
    expect(draft).toContain('Review correctness before handoff.');
  });

  it('creates a concise my-skill template when no node metadata is provided', () => {
    const draft = createSkillDraft();

    expect(draft).toContain('name: my-skill');
    expect(draft).toContain('# My Skill');
  });

  it('reads node metadata from SKILL.md frontmatter', () => {
    expect(
      readSkillMetadataFromContent(`---
name: release-handoff
description: Summarize outcomes before transfer.
---

# Release Handoff
`),
    ).toEqual({ label: 'Release Handoff', description: 'Summarize outcomes before transfer.' });
  });

  it('falls back to the first heading when frontmatter has no name', () => {
    expect(readSkillMetadataFromContent('# Browser Review\n\nRun e2e checks.')).toEqual({ label: 'Browser Review' });
  });

  it('reads node metadata from a skill reference path', () => {
    expect(readSkillMetadataFromReference('https://github.com/acme/harness/tree/main/skills/code-review/SKILL.md')).toEqual({
      label: 'Code Review',
    });
  });
});
