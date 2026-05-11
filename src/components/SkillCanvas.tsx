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
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { Maximize2, Rows3 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import { SkillNode } from '../schema/workflow';
import { useWorkflowStore } from '../store/workflowStore';
import { SkillGraphNode } from './SkillGraphNode';

const nodeTypes: NodeTypes = {
  skillNode: SkillGraphNode,
};

const defaultEdgeOptions = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: '#5b32e6', strokeWidth: 3 },
};

function CanvasActions({ onAutoLayout }: { onAutoLayout: () => void }) {
  const { fitView } = useReactFlow();

  return (
    <Panel position="top-right" className="canvas-actions">
      <button type="button" onClick={onAutoLayout}>
        <Rows3 size={16} /> Auto Layout
      </button>
      <button type="button" onClick={() => fitView({ padding: 0.18, duration: 360, maxZoom: 1 })}>
        <Maximize2 size={16} /> Fit View
      </button>
    </Panel>
  );
}

export function SkillCanvas() {
  const { t } = useI18n();
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

  const autoLayout = useCallback(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node, index) => ({
        ...node,
        position: { x: -260 + index * 180, y: 250 },
      })),
    );
  }, [setNodes]);

  return (
    <>
      <div className="canvas-hint">{t('canvas.editHint')}</div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.18, maxZoom: 1 }}
        maxZoom={1}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(undefined)}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
      >
        <Background color="#d7d2ff" gap={18} size={1.2} />
        <MiniMap zoomable pannable maskColor="rgba(248, 250, 255, 0.68)" />
        <Controls showInteractive={false} />
        <CanvasActions onAutoLayout={autoLayout} />
      </ReactFlow>
    </>
  );
}

function toReactFlowNodes(nodes: SkillNode[]): Node[] {
  return nodes.map((node, index) => ({
    id: node.id,
    type: 'skillNode',
    position: { x: -260 + index * 180, y: 250 },
    data: { ...node, order: index + 1 },
  }));
}

function toReactFlowEdges(edges: { id: string; source: string; target: string }[]): Edge[] {
  return edges.map((edge) => ({ ...edge, ...defaultEdgeOptions }));
}
