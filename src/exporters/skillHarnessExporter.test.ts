import { describe, expect, it } from 'vitest';
import { exportSkillHarness } from './skillHarnessExporter';
import { HarnessWorkflow } from '../schema/workflow';

const workflow: HarnessWorkflow = {
  id: 'demo',
  name: 'Demo harness',
  version: '0.1.0',
  entryNodeId: 'start',
  nodes: [
    { id: 'start', type: 'skill', label: 'Start', skillRef: 'skills/start/SKILL.md' },
    {
      id: 'finish',
      type: 'verification',
      label: 'Finish',
      skillRef: 'skills/finish/SKILL.md',
      skillContent: '# Finish\n\nVerify the work.\n',
    },
  ],
  edges: [{ id: 'start-finish', source: 'start', target: 'finish' }],
};

describe('exportSkillHarness', () => {
  it('exports workflow, manifest, and agent instructions', () => {
    const result = exportSkillHarness(workflow);

    expect(result.manifest.executionOrder).toEqual(['start', 'finish']);
    expect(result.artifacts.map((artifact) => artifact.path)).toEqual([
      'workflow.json',
      'manifest.json',
      'HARNESS.md',
      'skills/finish/SKILL.md',
    ]);
    expect(result.manifest.generatedSkills).toEqual(['skills/finish/SKILL.md']);
    expect(result.artifacts[2].content).toContain('## Execution order');
    expect(result.artifacts[3].content).toBe('# Finish\n\nVerify the work.\n');
  });
});
