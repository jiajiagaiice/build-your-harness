import { describe, expect, it } from 'vitest';
import { HarnessWorkflow, topologicallySortWorkflow, validateWorkflow } from './workflow';

const validWorkflow: HarnessWorkflow = {
  id: 'feature-dev',
  name: 'Feature development',
  version: '0.1.0',
  entryNodeId: 'plan',
  nodes: [
    { id: 'plan', type: 'skill', label: 'Plan', skillContent: '# Plan\n' },
    { id: 'build', type: 'skill', label: 'Build', skillRef: 'skills/build/SKILL.md' },
    { id: 'verify', type: 'verification', label: 'Verify', skillRef: 'skills/verify/SKILL.md' },
  ],
  edges: [
    { id: 'plan-build', source: 'plan', target: 'build' },
    { id: 'build-verify', source: 'build', target: 'verify' },
  ],
};

describe('workflow validation', () => {
  it('accepts a valid directed acyclic workflow', () => {
    expect(validateWorkflow(validWorkflow)).toEqual({ valid: true, errors: [] });
  });

  it('rejects workflows with cycles', () => {
    const result = validateWorkflow({
      ...validWorkflow,
      edges: [...validWorkflow.edges, { id: 'verify-plan', source: 'verify', target: 'plan' }],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('workflow graph must be acyclic');
  });

  it('requires exactly one skill source per node', () => {
    expect(
      validateWorkflow({
        ...validWorkflow,
        nodes: [{ id: 'plan', type: 'skill', label: 'Plan' }],
      }).errors,
    ).toContain('nodes.0.skillRef: provide exactly one of skillRef or skillContent');

    expect(
      validateWorkflow({
        ...validWorkflow,
        nodes: [
          {
            id: 'plan',
            type: 'skill',
            label: 'Plan',
            skillRef: 'skills/plan/SKILL.md',
            skillContent: '# Plan\n',
          },
        ],
      }).errors,
    ).toContain('nodes.0.skillRef: provide exactly one of skillRef or skillContent');
  });

  it('sorts workflow nodes in executable order', () => {
    expect(topologicallySortWorkflow(validWorkflow).map((node) => node.id)).toEqual([
      'plan',
      'build',
      'verify',
    ]);
  });
});
