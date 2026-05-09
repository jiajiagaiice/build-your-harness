import { create } from 'zustand';
import { HarnessWorkflow, SkillEdge, SkillNode } from '../schema/workflow';

export const initialWorkflow: HarnessWorkflow = {
  id: 'development-superpowers',
  name: 'Development Superpowers Harness',
  version: '0.1.0',
  description: 'A Superpowers-inspired development harness for building reliable AI-agent workflows.',
  entryNodeId: 'using-superpowers',
  nodes: [
    {
      id: 'using-superpowers',
      type: 'skill',
      label: 'Use Superpowers',
      skillRef: 'skills/development-superpowers/using-superpowers/SKILL.md',
      description: 'Select and load only the skills needed for the current development task.',
    },
    {
      id: 'brainstorming',
      type: 'skill',
      label: 'Brainstorming',
      skillRef: 'skills/development-superpowers/brainstorming/SKILL.md',
      description: 'Clarify the goal, constraints, risks, and acceptance criteria.',
    },
    {
      id: 'writing-plans',
      type: 'skill',
      label: 'Writing Plans',
      skillRef: 'skills/development-superpowers/writing-plans/SKILL.md',
      description: 'Create an implementation plan with validation checkpoints.',
    },
    {
      id: 'executing-plans',
      type: 'skill',
      label: 'Executing Plans',
      skillRef: 'skills/development-superpowers/executing-plans/SKILL.md',
      description: 'Execute the plan incrementally and keep status visible.',
    },
    {
      id: 'test-driven-development',
      type: 'verification',
      label: 'Test Driven Development',
      skillRef: 'skills/development-superpowers/test-driven-development/SKILL.md',
      description: 'Add checks that lock in expected behavior.',
    },
    {
      id: 'requesting-code-review',
      type: 'verification',
      label: 'Requesting Code Review',
      skillRef: 'skills/development-superpowers/requesting-code-review/SKILL.md',
      description: 'Review changes for correctness, maintainability, and risks.',
    },
    {
      id: 'verification-before-completion',
      type: 'verification',
      label: 'Verification Before Completion',
      skillRef: 'skills/development-superpowers/verification-before-completion/SKILL.md',
      description: 'Finish with explicit validation and handoff notes.',
    },
  ],
  edges: [
    { id: 'using-superpowers-brainstorming', source: 'using-superpowers', target: 'brainstorming' },
    { id: 'brainstorming-writing-plans', source: 'brainstorming', target: 'writing-plans' },
    { id: 'writing-plans-executing-plans', source: 'writing-plans', target: 'executing-plans' },
    { id: 'executing-plans-test-driven-development', source: 'executing-plans', target: 'test-driven-development' },
    { id: 'test-driven-development-requesting-code-review', source: 'test-driven-development', target: 'requesting-code-review' },
    { id: 'requesting-code-review-verification-before-completion', source: 'requesting-code-review', target: 'verification-before-completion' },
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
