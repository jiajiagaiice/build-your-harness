import { Code2, Rocket, Search, Shield, Sparkles, Target, Workflow, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { reusableSkills, searchSkills, SkillMetadata } from '../registry/skills';
import { SkillNode } from '../schema/workflow';
import { createSkillDraft, readSkillMetadataFromContent } from '../skillContent';
import { useWorkflowStore } from '../store/workflowStore';

const skillIconByName: Record<string, typeof Target> = {
  'intake-discovery': Target,
  'solution-design': Zap,
  implementation: Code2,
  'quality-review': Shield,
  'release-handoff': Rocket,
};

function PaletteIcon({ skill }: { skill?: SkillMetadata }) {
  const Icon = skill ? skillIconByName[skill.name] ?? Workflow : Sparkles;
  return (
    <span className={`palette-card__icon ${skill ? `palette-card__icon--${skill.name}` : 'palette-card__icon--template'}`}>
      <Icon size={20} />
    </span>
  );
}

type SkillPaletteProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function SkillPalette({ collapsed, onToggleCollapse }: SkillPaletteProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const skills = useMemo(() => searchSkills(query, reusableSkills), [query]);
  const { workflow, setNodes, setEdges, selectNode } = useWorkflowStore();

  const addMySkill = () => {
    const id = `my-skill-${workflow.nodes.length + 1}`;
    const skillContent = createSkillDraft({ id, label: 'My Skill' });
    const nextNode: SkillNode = {
      id,
      type: 'skill',
      label: 'My Skill',
      skillContent,
      ...readSkillMetadataFromContent(skillContent),
    };
    const previousNode = workflow.nodes.at(-1);
    setNodes([...workflow.nodes, nextNode]);
    if (previousNode) {
      setEdges([...workflow.edges, { id: `${previousNode.id}-${id}`, source: previousNode.id, target: id }]);
    }
    selectNode(id);
  };

  return (
    <aside id="skills" className={`panel palette ${collapsed ? 'palette--collapsed' : ''}`} aria-expanded={!collapsed}>
      <div className="panel__heading">
        <h2>{t('palette.title')}</h2>
        <button
          type="button"
          className="panel__collapse"
          aria-label={collapsed ? 'Expand skill palette' : 'Collapse skill palette'}
          onClick={onToggleCollapse}
        >
          {collapsed ? '››' : '‹‹'}
        </button>
      </div>
      <div className="palette__content" hidden={collapsed}>
        <label className="palette__search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('palette.search')}
            aria-label={t('palette.search')}
          />
          <kbd>⌘K</kbd>
        </label>
        <button type="button" className="palette-card palette__template" onClick={addMySkill}>
          <PaletteIcon />
          <span className="palette-card__copy">
            <strong>My Skill</strong>
            <span>Start with a concise editable SKILL.md template.</span>
          </span>
        </button>
        <div className="palette__list">
          {skills.map((skill) => (
            <button
              key={skill.name}
              type="button"
              className="palette-card"
              aria-label={t('palette.addSkill', { name: skill.displayName })}
              onClick={() => {
                const id = `${skill.name}-${workflow.nodes.length + 1}`;
                const nextNode: SkillNode = {
                  id,
                  type: skill.nodeType,
                  label: skill.displayName,
                  skillRef: skill.path,
                  description: skill.description,
                };
                const previousNode = workflow.nodes.at(-1);
                setNodes([...workflow.nodes, nextNode]);
                if (previousNode) {
                  setEdges([...workflow.edges, { id: `${previousNode.id}-${id}`, source: previousNode.id, target: id }]);
                }
                selectNode(id);
              }}
            >
              <PaletteIcon skill={skill} />
              <span className="palette-card__copy">
                <strong>{skill.displayName}</strong>
                <span>{skill.description}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="palette__tip">
          <Sparkles size={17} />
          <span><strong>Tip:</strong> Click any skill card or its + badge to add it to the canvas.</span>
        </div>
      </div>
    </aside>
  );
}
