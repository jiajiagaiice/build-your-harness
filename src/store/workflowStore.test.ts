import { describe, expect, it } from 'vitest';
import { validateWorkflow } from '../schema/workflow';
import { initialWorkflow } from './workflowStore';

describe('initial workflow', () => {
  it('opens on a blank valid canvas without default skills', () => {
    const serialized = JSON.stringify(initialWorkflow);

    expect(initialWorkflow.id).toBe('starter-agent-harness');
    expect(initialWorkflow.entryNodeId).toBe('');
    expect(initialWorkflow.nodes).toEqual([]);
    expect(initialWorkflow.edges).toEqual([]);
    expect(validateWorkflow(initialWorkflow).valid).toBe(true);
    expect(serialized.toLowerCase()).not.toContain('superpowers');
    expect(serialized).not.toContain('skills/development-superpowers');
  });
});
