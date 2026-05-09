import { SkillNodeTypeSchema } from '../schema/workflow';
import { useWorkflowStore } from '../store/workflowStore';

const nodeTypes = SkillNodeTypeSchema.options;

export function NodeInspector() {
  const { workflow, selectedNodeId, updateNode } = useWorkflowStore();
  const node = workflow.nodes.find((item) => item.id === selectedNodeId);

  if (!node) {
    return (
      <aside className="panel inspector">
        <h2>Inspector</h2>
        <p>Select a skill node to edit its label, type, reference, and description.</p>
      </aside>
    );
  }

  return (
    <aside className="panel inspector">
      <h2>Inspector</h2>
      <label>
        Label
        <input value={node.label} onChange={(event) => updateNode(node.id, { label: event.target.value })} />
      </label>
      <label>
        Type
        <select value={node.type} onChange={(event) => updateNode(node.id, { type: event.target.value as typeof node.type })}>
          {nodeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Skill reference
        <input value={node.skillRef ?? ''} onChange={(event) => updateNode(node.id, { skillRef: event.target.value })} />
      </label>
      <label>
        Description
        <textarea
          value={node.description ?? ''}
          onChange={(event) => updateNode(node.id, { description: event.target.value })}
          rows={6}
        />
      </label>
    </aside>
  );
}
