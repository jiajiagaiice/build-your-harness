import { useState } from 'react';
import { SkillNode } from '../schema/workflow';
import { createSkillDraft, readSkillMetadataFromContent, readSkillMetadataFromReference } from '../skillContent';
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

    if (mode === 'reference') {
      updateNode(node.id, { skillContent: undefined });
      return;
    }

    const skillContent = node.skillContent ?? createSkillDraft(node);
    updateNode(node.id, { skillRef: undefined, skillContent, ...readSkillMetadataFromContent(skillContent) });
  };

  const updateReference = (reference: string) => {
    updateNode(node.id, {
      skillRef: reference || undefined,
      skillContent: undefined,
      ...readSkillMetadataFromReference(reference),
    });
  };

  const updateContent = (skillContent: string) => {
    updateNode(node.id, {
      skillRef: undefined,
      skillContent,
      ...readSkillMetadataFromContent(skillContent),
    });
  };

  return (
    <>
      <div className="inspector__metadata-card">
        <span>{t('inspector.detectedMetadata')}</span>
        <strong>{node.label}</strong>
        {node.description ? <p>{node.description}</p> : <p>{t('inspector.noDescription')}</p>}
      </div>
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
          <input value={node.skillRef ?? ''} placeholder={t('inspector.skillRefPlaceholder')} onChange={(event) => updateReference(event.target.value)} />
        </label>
      ) : (
        <div className="inspector__section">
          <div className="inspector__section-heading">
            <span>{t('inspector.skillContent')}</span>
            <button type="button" onClick={() => updateContent(createSkillDraft({ id: 'my-skill', label: 'My Skill' }))}>
              {t('inspector.useTemplate')}
            </button>
          </div>
          <p className="inspector__help">{t('inspector.skillContentHelp')}</p>
          <textarea
            aria-label={t('inspector.skillContent')}
            value={node.skillContent ?? ''}
            onChange={(event) => updateContent(event.target.value)}
            rows={15}
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
      <SourceEditor key={node.id} node={node} updateNode={updateNode} />
    </aside>
  );
}
