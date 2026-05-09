import '@xyflow/react/dist/style.css';
import {
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo } from 'react';
import { SkillNode } from '../schema/workflow';
import { useWorkflowStore } from '../store/workflowStore';
import { SkillGraphNode } from './SkillGraphNode';

const nodeTypes: NodeTypes = {
  skillNode: SkillGraphNode,
};

const defaultEdgeOptions = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed },
};

export function SkillCanvas() {
  const { workflow, setNodes: setWorkflowNodes, setEdges: setWorkflowEdges, selectNode } = useWorkflowStore();

  const initialNodes = useMemo(() => toReactFlowNodes(workflow.nodes), [workflow.nodes]);
  const initialEdges = useMemo(() => toReactFlowEdges(workflow.edges), [workflow.edges]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(toReactFlowNodes(workflow.nodes));
    setEdges(toReactFlowEdges(workflow.edges));
  }, [setEdges, setNodes, workflow.edges, workflow.nodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const nextEdges = addEdge({ ...connection, ...defaultEdgeOptions }, edges);
      setEdges(nextEdges);
      setWorkflowEdges(
        nextEdges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      );
    },
    [edges, setEdges, setWorkflowEdges],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = new Set(deleted.map((node) => node.id));
      setWorkflowNodes(workflow.nodes.filter((node) => !deletedIds.has(node.id)));
      setWorkflowEdges(workflow.edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)));
    },
    [setWorkflowEdges, setWorkflowNodes, workflow.edges, workflow.nodes],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const deletedIds = new Set(deleted.map((edge) => edge.id));
      setWorkflowEdges(workflow.edges.filter((edge) => !deletedIds.has(edge.id)));
    },
    [setWorkflowEdges, workflow.edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      fitView
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, node) => selectNode(node.id)}
      onPaneClick={() => selectNode(undefined)}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
    >
      <Background />
      <MiniMap zoomable pannable />
      <Controls />
    </ReactFlow>
  );
}

function toReactFlowNodes(nodes: SkillNode[]): Node[] {
  return nodes.map((node, index) => ({
    id: node.id,
    type: 'skillNode',
    position: { x: 80 + index * 240, y: 120 + (index % 2) * 90 },
    data: node,
  }));
}

function toReactFlowEdges(edges: { id: string; source: string; target: string }[]): Edge[] {
  return edges.map((edge) => ({ ...edge, ...defaultEdgeOptions }));
}
