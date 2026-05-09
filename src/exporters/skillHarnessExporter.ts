import { HarnessWorkflow, topologicallySortWorkflow, validateWorkflow } from '../schema/workflow';

export type HarnessExportArtifact = {
  path: string;
  content: string;
};

export type HarnessExportResult = {
  manifest: {
    id: string;
    name: string;
    version: string;
    entryNodeId: string;
    executionOrder: string[];
    skills: string[];
  };
  artifacts: HarnessExportArtifact[];
};

export function exportSkillHarness(workflow: HarnessWorkflow): HarnessExportResult {
  const validation = validateWorkflow(workflow);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }

  const orderedNodes = topologicallySortWorkflow(workflow);
  const skills = workflow.nodes.flatMap((node) => (node.skillRef ? [node.skillRef] : []));
  const manifest = {
    id: workflow.id,
    name: workflow.name,
    version: workflow.version,
    entryNodeId: workflow.entryNodeId,
    executionOrder: orderedNodes.map((node) => node.id),
    skills,
  };

  return {
    manifest,
    artifacts: [
      {
        path: 'workflow.json',
        content: `${JSON.stringify(workflow, null, 2)}\n`,
      },
      {
        path: 'manifest.json',
        content: `${JSON.stringify(manifest, null, 2)}\n`,
      },
      {
        path: 'HARNESS.md',
        content: renderHarnessInstructions(workflow, orderedNodes),
      },
    ],
  };
}

function renderHarnessInstructions(workflow: HarnessWorkflow, orderedNodes: HarnessWorkflow['nodes']): string {
  const steps = orderedNodes
    .map((node, index) => `${index + 1}. **${node.label}** (${node.type})${node.skillRef ? ` — load \`${node.skillRef}\`` : ''}`)
    .join('\n');

  return `# ${workflow.name}\n\nVersion: ${workflow.version}\n\n${workflow.description ?? 'Follow this harness workflow in order unless the user explicitly overrides it.'}\n\n## Execution order\n\n${steps}\n`;
}
