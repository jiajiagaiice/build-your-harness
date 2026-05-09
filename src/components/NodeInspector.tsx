import { useMemo } from 'react';
import { SkillNodeTypeSchema } from '../schema/workflow';
import { createSkillDraft, createSkillGenerationPrompt } from '../skillContent';
import { useWorkflowStore } from '../store/workflowStore';
import { useI18n } from '../i18n';

const nodeTypes = SkillNodeTypeSchema.options;

export function NodeInspector() {
  const { t } = useI18n();
  const { workflow, selectedNodeId, updateNode } = useWorkflowStore();
  const node = workflow.nodes.find((item) => item.id === selectedNodeId);
  const aiPrompt = useMemo(() => (node ? createSkillGenerationPrompt(node) : ''), [node]);

  if (!node) {
    return (
      <aside className="panel inspector">
        <h2>{t('inspector.emptyTitle')}</h2>
        <p>{t('inspector.emptyBody')}</p>
      </aside>
    );
  }

  return (
    <aside className="panel inspector">
      <h2>{t('inspector.title')}</h2>
      <label>
        {t('inspector.label')}
        <input value={node.label} onChange={(event) => updateNode(node.id, { label: event.target.value })} />
      </label>
      <label>
        {t('inspector.type')}
        <select value={node.type} onChange={(event) => updateNode(node.id, { type: event.target.value as typeof node.type })}>
          {nodeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('inspector.skillRef')}
        <input value={node.skillRef ?? ''} onChange={(event) => updateNode(node.id, { skillRef: event.target.value })} />
      </label>
      <label>
        {t('inspector.description')}
        <textarea
          value={node.description ?? ''}
          onChange={(event) => updateNode(node.id, { description: event.target.value })}
          rows={4}
        />
      </label>
      <div className="inspector__section">
        <div className="inspector__section-heading">
          <span>{t('inspector.skillContent')}</span>
          <button type="button" onClick={() => updateNode(node.id, { skillContent: createSkillDraft(node) })}>
            {t('inspector.generateWithAi')}
          </button>
        </div>
        <p className="inspector__help">{t('inspector.skillContentHelp')}</p>
        <textarea
          aria-label={t('inspector.skillContent')}
          value={node.skillContent ?? ''}
          onChange={(event) => updateNode(node.id, { skillContent: event.target.value })}
          rows={12}
        />
      </div>
      <details className="inspector__section">
        <summary>{t('inspector.aiPrompt')}</summary>
        <p className="inspector__help">{t('inspector.aiPromptHelp')}</p>
        <textarea readOnly value={aiPrompt} rows={9} />
        <button type="button" className="inspector__secondary-action" onClick={() => void navigator.clipboard.writeText(aiPrompt)}>
          {t('inspector.copyPrompt')}
        </button>
      </details>
    </aside>
  );
}
