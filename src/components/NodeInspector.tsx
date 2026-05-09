import { useMemo, useState } from 'react';
import { SkillNode } from '../schema/workflow';
import { createSkillDraft, createSkillGenerationPrompt } from '../skillContent';
import { useWorkflowStore } from '../store/workflowStore';
import { useI18n } from '../i18n';

type SkillSourceMode = 'reference' | 'content';

type SourceEditorProps = {
  node: SkillNode;
  updateNode: (nodeId: string, patch: Partial<SkillNode>) => void;
};

function getInitialSourceMode(node: SkillNode): SkillSourceMode {
  return node.skillRef ? 'reference' : 'content';
}

function SourceEditor({ node, updateNode }: SourceEditorProps) {
  const { t } = useI18n();
  const [sourceMode, setSourceMode] = useState<SkillSourceMode>(() => getInitialSourceMode(node));
  const selectSourceMode = (mode: SkillSourceMode) => {
    setSourceMode(mode);
    updateNode(node.id, mode === 'reference' ? { skillContent: undefined } : { skillRef: undefined });
  };

  return (
    <>
      <fieldset className="inspector__source">
        <legend>{t('inspector.skillSource')}</legend>
        <p className="inspector__help">{t('inspector.skillSourceHelp')}</p>
        <label className="inspector__radio">
          <input
            type="radio"
            name={`skill-source-${node.id}`}
            value="reference"
            checked={sourceMode === 'reference'}
            onChange={() => selectSourceMode('reference')}
          />
          <span>{t('inspector.skillRefMode')}</span>
        </label>
        <label className="inspector__radio">
          <input
            type="radio"
            name={`skill-source-${node.id}`}
            value="content"
            checked={sourceMode === 'content'}
            onChange={() => selectSourceMode('content')}
          />
          <span>{t('inspector.skillContentMode')}</span>
        </label>
      </fieldset>
      {sourceMode === 'reference' ? (
        <label>
          {t('inspector.skillRef')}
          <input
            value={node.skillRef ?? ''}
            placeholder={t('inspector.skillRefPlaceholder')}
            onChange={(event) => updateNode(node.id, { skillRef: event.target.value || undefined, skillContent: undefined })}
          />
        </label>
      ) : (
        <div className="inspector__section">
          <div className="inspector__section-heading">
            <span>{t('inspector.skillContent')}</span>
            <button
              type="button"
              onClick={() => updateNode(node.id, { skillRef: undefined, skillContent: createSkillDraft(node) })}
            >
              {t('inspector.generateWithAi')}
            </button>
          </div>
          <p className="inspector__help">{t('inspector.skillContentHelp')}</p>
          <textarea
            aria-label={t('inspector.skillContent')}
            value={node.skillContent ?? ''}
            onChange={(event) => updateNode(node.id, { skillRef: undefined, skillContent: event.target.value })}
            rows={12}
          />
        </div>
      )}
    </>
  );
}

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
        {t('inspector.description')}
        <textarea
          value={node.description ?? ''}
          onChange={(event) => updateNode(node.id, { description: event.target.value })}
          rows={4}
        />
      </label>
      <SourceEditor key={node.id} node={node} updateNode={updateNode} />
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
