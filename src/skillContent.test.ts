import { describe, expect, it } from 'vitest';
import { createSkillDraft, createSkillGenerationPrompt } from './skillContent';

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

  it('creates an AI prompt that includes editable node context', () => {
    const prompt = createSkillGenerationPrompt(node);

    expect(prompt).toContain('Node id: code-review');
    expect(prompt).toContain('Type: verification');
    expect(prompt).toContain('Return only valid Markdown for SKILL.md');
  });
});
