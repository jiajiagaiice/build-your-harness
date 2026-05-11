import { create } from 'zustand';
import { HarnessWorkflow, SkillEdge, SkillNode } from '../schema/workflow';

export const initialWorkflow: HarnessWorkflow = {
  id: 'starter-agent-harness',
  name: 'Starter Agent Harness',
  version: '0.1.0',
  description: 'Start from a blank canvas and add only the skills this harness needs.',
  entryNodeId: '',
  nodes: [],
  edges: [],
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

function getEntryNodeId(nodes: SkillNode[], currentEntryNodeId: string) {
  if (nodes.length === 0) {
    return '';
  }

  return nodes.some((node) => node.id === currentEntryNodeId) ? currentEntryNodeId : nodes[0].id;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflow: initialWorkflow,
  selectedNodeId: undefined,
  setWorkflow: (workflow) => set({ workflow, selectedNodeId: undefined }),
  setNodes: (nodes) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes,
        entryNodeId: getEntryNodeId(nodes, state.workflow.entryNodeId),
      },
    })),
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
