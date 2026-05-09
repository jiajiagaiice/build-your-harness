import { describe, expect, it } from 'vitest';
import { HarnessWorkflow, topologicallySortWorkflow, validateWorkflow } from './workflow';

const validWorkflow: HarnessWorkflow = {
  id: 'feature-dev',
  name: 'Feature development',
  version: '0.1.0',
  entryNodeId: 'plan',
  nodes: [
    { id: 'plan', type: 'skill', label: 'Plan', skillContent: '# Plan\n' },
    { id: 'build', type: 'skill', label: 'Build' },
    { id: 'verify', type: 'verification', label: 'Verify' },
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

  it('sorts workflow nodes in executable order', () => {
    expect(topologicallySortWorkflow(validWorkflow).map((node) => node.id)).toEqual([
      'plan',
      'build',
      'verify',
    ]);
  });
});
