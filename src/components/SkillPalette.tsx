import { useMemo, useState } from 'react';
import { developmentSkills, searchSkills } from '../registry/skills';
import { useWorkflowStore } from '../store/workflowStore';

export function SkillPalette() {
  const [query, setQuery] = useState('');
  const skills = useMemo(() => searchSkills(query, developmentSkills), [query]);
  const { workflow, setNodes } = useWorkflowStore();

  return (
    <aside className="panel palette">
      <h2>Skill Palette</h2>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search skills"
        aria-label="Search skills"
      />
      <div className="palette__list">
        {skills.map((skill) => (
          <button
            key={skill.name}
            type="button"
            onClick={() =>
              setNodes([
                ...workflow.nodes,
                {
                  id: `${skill.name}-${workflow.nodes.length + 1}`,
                  type: skill.nodeType,
                  label: skill.displayName,
                  skillRef: skill.path,
                  description: skill.description,
                },
              ])
            }
          >
            <strong>{skill.displayName}</strong>
            <span>{skill.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
