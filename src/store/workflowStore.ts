import { create } from 'zustand';
import { HarnessWorkflow, SkillEdge, SkillNode } from '../schema/workflow';

export const initialWorkflow: HarnessWorkflow = {
  id: 'starter-agent-harness',
  name: 'Starter Agent Harness',
  version: '0.1.0',
  description: 'A reusable starter workflow for guiding an AI agent from discovery through delivery.',
  entryNodeId: 'intake-discovery',
  nodes: [
    {
      id: 'intake-discovery',
      type: 'skill',
      label: 'Intake Discovery',
      skillRef: 'skills/catalog/intake-discovery/SKILL.md',
      description: 'Capture the user goal, context, constraints, and acceptance criteria before planning.',
    },
    {
      id: 'solution-design',
      type: 'skill',
      label: 'Solution Design',
      skillRef: 'skills/catalog/solution-design/SKILL.md',
      description: 'Compare viable approaches and select a plan that fits the workflow constraints.',
    },
    {
      id: 'implementation',
      type: 'skill',
      label: 'Implementation',
      skillRef: 'skills/catalog/implementation/SKILL.md',
      description: 'Make focused changes while keeping progress, assumptions, and risks visible.',
    },
    {
      id: 'quality-review',
      type: 'verification',
      label: 'Quality Review',
      skillRef: 'skills/catalog/quality-review/SKILL.md',
      description: 'Review correctness, maintainability, edge cases, and user-visible behavior before handoff.',
    },
    {
      id: 'release-handoff',
      type: 'verification',
      label: 'Release Handoff',
      skillRef: 'skills/catalog/release-handoff/SKILL.md',
      description: 'Summarize outcomes, checks, limitations, and follow-up actions for the next operator.',
    },
  ],
  edges: [
    { id: 'intake-discovery-solution-design', source: 'intake-discovery', target: 'solution-design' },
    { id: 'solution-design-implementation', source: 'solution-design', target: 'implementation' },
    { id: 'implementation-quality-review', source: 'implementation', target: 'quality-review' },
    { id: 'quality-review-release-handoff', source: 'quality-review', target: 'release-handoff' },
  ],
};

type WorkflowState = {
  workflow: HarnessWorkflow;
  selectedNodeId?: string;
  setWorkflow: (workflow: HarnessWorkflow) => void;
  setNodes: (nodes: SkillNode[]) => void;
  setEdges: (edges: SkillEdge[]) => void;
  selectNode: (nodeId?: string) => void;
  updateNode: (nodeId: string, patch: Partial<SkillNode>) => void;
};

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflow: initialWorkflow,
  selectedNodeId: undefined,
  setWorkflow: (workflow) => set({ workflow, selectedNodeId: undefined }),
  setNodes: (nodes) => set((state) => ({ workflow: { ...state.workflow, nodes } })),
  setEdges: (edges) => set((state) => ({ workflow: { ...state.workflow, edges } })),
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  updateNode: (nodeId, patch) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: state.workflow.nodes.map((node) => (node.id === nodeId ? { ...node, ...patch } : node)),
      },
    })),
}));
