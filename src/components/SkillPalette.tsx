import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { reusableSkills, searchSkills } from '../registry/skills';
import { createSkillDraft, readSkillMetadataFromContent } from '../skillContent';
import { useWorkflowStore } from '../store/workflowStore';

export function SkillPalette() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const skills = useMemo(() => searchSkills(query, reusableSkills), [query]);
  const { workflow, setNodes, selectNode } = useWorkflowStore();

  const addMySkill = () => {
    const id = `my-skill-${workflow.nodes.length + 1}`;
    const skillContent = createSkillDraft({ id, label: 'My Skill' });
    setNodes([
      ...workflow.nodes,
      {
        id,
        type: 'skill',
        label: 'My Skill',
        skillContent,
        ...readSkillMetadataFromContent(skillContent),
      },
    ]);
    selectNode(id);
  };

  return (
    <aside className="panel palette">
      <h2>{t('palette.title')}</h2>
      <button type="button" className="palette__template" onClick={addMySkill}>
        <strong>My Skill</strong>
        <span>Start with a concise editable SKILL.md template.</span>
      </button>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('palette.search')}
        aria-label={t('palette.search')}
      />
      <div className="palette__list">
        {skills.map((skill) => (
          <button
            key={skill.name}
            type="button"
            aria-label={t('palette.addSkill', { name: skill.displayName })}
            onClick={() => {
              const id = `${skill.name}-${workflow.nodes.length + 1}`;
              setNodes([
                ...workflow.nodes,
                {
                  id,
                  type: skill.nodeType,
                  label: skill.displayName,
                  skillRef: skill.path,
                  description: skill.description,
                },
              ]);
              selectNode(id);
            }}
          >
            <strong>{skill.displayName}</strong>
            <span>{skill.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
