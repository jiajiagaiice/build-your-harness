import { Code2, Rocket, Shield, Target, Zap } from 'lucide-react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { SkillNode } from '../schema/workflow';

type SkillNodeData = SkillNode & { order?: number };

const iconByLabel = [
  { match: /intake|discovery/i, Icon: Target, tone: 'blue' },
  { match: /solution|design/i, Icon: Zap, tone: 'teal' },
  { match: /implementation|code/i, Icon: Code2, tone: 'purple' },
  { match: /quality|review|verification/i, Icon: Shield, tone: 'amber' },
  { match: /release|handoff/i, Icon: Rocket, tone: 'pink' },
];

function getNodeIcon(node: SkillNode) {
  return iconByLabel.find((item) => item.match.test(node.label)) ?? iconByLabel[2];
}

export function SkillGraphNode({ data, selected }: NodeProps) {
  const node = data as unknown as SkillNodeData;
  const { Icon, tone } = getNodeIcon(node);

  return (
    <div className={`skill-node skill-node--${tone} ${selected ? 'skill-node--selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      {node.order ? <span className="skill-node__order">{node.order}</span> : null}
      <span className="skill-node__icon"><Icon size={24} /></span>
      <div className="skill-node__label">{node.label}</div>
      {node.description ? <p>{node.description}</p> : null}
      <div className="skill-node__badges">
        {node.skillContent || node.skillRef ? <span>SKILL.md</span> : null}
        <span>editable</span>
        <span className="skill-node__ready">Ready</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
