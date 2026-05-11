import { describe, expect, it } from 'vitest';
import { reusableSkills, searchSkills } from './skills';

describe('reusable skill registry', () => {
  it('exposes only product-facing skills by default', () => {
    const serialized = JSON.stringify(searchSkills(''));

    expect(serialized.toLowerCase()).not.toContain('superpowers');
    expect(serialized).not.toContain('skills/development-superpowers');
    expect(reusableSkills.map((skill) => skill.name)).toEqual([
      'intake-discovery',
      'solution-design',
      'implementation',
      'quality-review',
      'release-handoff',
    ]);
  });

  it('searches the product-facing catalog', () => {
    expect(searchSkills('review').map((skill) => skill.name)).toEqual(['quality-review']);
  });
});
