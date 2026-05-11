import { describe, expect, it } from 'vitest';
import { initialWorkflow } from './workflowStore';

describe('initial workflow', () => {
  it('uses the product-facing starter harness instead of the development harness', () => {
    const serialized = JSON.stringify(initialWorkflow);

    expect(initialWorkflow.id).toBe('starter-agent-harness');
    expect(serialized.toLowerCase()).not.toContain('superpowers');
    expect(serialized).not.toContain('skills/development-superpowers');
  });
});
