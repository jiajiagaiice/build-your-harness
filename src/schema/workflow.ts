import { z } from 'zod';

export const SkillNodeTypeSchema = z.enum([
  'skill',
  'gate',
  'state',
  'verification',
  'human-approval',
]);

export type SkillNodeType = z.infer<typeof SkillNodeTypeSchema>;

export const SkillNodeSchema = z.object({
  id: z.string().min(1),
  type: SkillNodeTypeSchema.default('skill'),
  label: z.string().min(1),
  skillRef: z.string().optional(),
  description: z.string().optional(),
  skillContent: z.string().optional(),
  inputs: z.record(z.string(), z.unknown()).optional(),
  outputs: z.record(z.string(), z.unknown()).optional(),
});

export const SkillEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  condition: z.string().optional(),
});

export const HarnessWorkflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  entryNodeId: z.string().min(1),
  nodes: z.array(SkillNodeSchema).min(1),
  edges: z.array(SkillEdgeSchema),
});

export type SkillNode = z.infer<typeof SkillNodeSchema>;
export type SkillEdge = z.infer<typeof SkillEdgeSchema>;
export type HarnessWorkflow = z.infer<typeof HarnessWorkflowSchema>;

export type WorkflowValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateWorkflow(workflow: unknown): WorkflowValidationResult {
  const parsed = HarnessWorkflowSchema.safeParse(workflow);

  if (!parsed.success) {
    return {
      valid: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    };
  }

  const errors = validateWorkflowGraph(parsed.data);
  return { valid: errors.length === 0, errors };
}

export function validateWorkflowGraph(workflow: HarnessWorkflow): string[] {
  const errors: string[] = [];
  const nodeIds = new Set(workflow.nodes.map((node) => node.id));

  if (!nodeIds.has(workflow.entryNodeId)) {
    errors.push(`entryNodeId "${workflow.entryNodeId}" does not match any node`);
  }

  for (const edge of workflow.edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`edge "${edge.id}" source "${edge.source}" does not match any node`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`edge "${edge.id}" target "${edge.target}" does not match any node`);
    }
  }

  if (hasCycle(workflow)) {
    errors.push('workflow graph must be acyclic');
  }

  return errors;
}

export function topologicallySortWorkflow(workflow: HarnessWorkflow): SkillNode[] {
  const graphErrors = validateWorkflowGraph(workflow);
  if (graphErrors.length > 0) {
    throw new Error(graphErrors.join('; '));
  }

  const nodeById = new Map(workflow.nodes.map((node) => [node.id, node]));
  const indegree = new Map(workflow.nodes.map((node) => [node.id, 0]));
  const adjacency = new Map(workflow.nodes.map((node) => [node.id, [] as string[]]));

  for (const edge of workflow.edges) {
    adjacency.get(edge.source)?.push(edge.target);
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  }

  const queue = workflow.nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const sorted: SkillNode[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeById.get(nodeId);
    if (node) {
      sorted.push(node);
    }

    for (const next of adjacency.get(nodeId) ?? []) {
      indegree.set(next, (indegree.get(next) ?? 0) - 1);
      if (indegree.get(next) === 0) {
        queue.push(next);
      }
    }
  }

  return sorted;
}

function hasCycle(workflow: HarnessWorkflow): boolean {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const adjacency = new Map(workflow.nodes.map((node) => [node.id, [] as string[]]));

  for (const edge of workflow.edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  const visit = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (visit(next)) {
        return true;
      }
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };

  return workflow.nodes.some((node) => visit(node.id));
}
