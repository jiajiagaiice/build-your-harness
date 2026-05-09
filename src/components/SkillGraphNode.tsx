import { Handle, NodeProps, Position } from '@xyflow/react';
import { SkillNode } from '../schema/workflow';

export function SkillGraphNode({ data, selected }: NodeProps) {
  const node = data as unknown as SkillNode;

  return (
    <div className={`skill-node ${selected ? 'skill-node--selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="skill-node__type">{node.type}</div>
      <div className="skill-node__label">{node.label}</div>
      {node.description ? <p>{node.description}</p> : null}
      {node.skillContent ? <div className="skill-node__content-badge">SKILL.md</div> : null}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
