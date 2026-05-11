import { Copy, ExternalLink, Info, Layers3, Trash2, Target } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n';
import { SkillNode } from '../schema/workflow';
import { createSkillDraft, readSkillMetadataFromContent, readSkillMetadataFromReference } from '../skillContent';
import { useWorkflowStore } from '../store/workflowStore';

type SkillSourceMode = 'reference' | 'content';

type NodeInspectorProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

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
      <label>
        Name
        <input value={node.label} onChange={(event) => updateNode(node.id, { label: event.target.value })} />
      </label>
      <label>
        Description
        <textarea
          value={node.description ?? ''}
          onChange={(event) => updateNode(node.id, { description: event.target.value })}
          rows={4}
        />
      </label>
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
          <span className="inspector__source-row">
            <input value={node.skillRef ?? ''} placeholder={t('inspector.skillRefPlaceholder')} onChange={(event) => updateReference(event.target.value)} />
            <Copy size={17} aria-hidden="true" />
          </span>
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
      <div className="inspector__chips">
        <span>user_request ×</span>
        <span>repo_context ×</span>
      </div>
      <div className="inspector__chips inspector__chips--outputs">
        <span>spec.md ×</span>
        <span>acceptance_criteria ×</span>
      </div>
    </>
  );
}

export function NodeInspector({ collapsed, onToggleCollapse }: NodeInspectorProps) {
  const { t } = useI18n();
  const { workflow, selectedNodeId, updateNode, setNodes, setEdges, selectNode } = useWorkflowStore();
  const node = workflow.nodes.find((item) => item.id === selectedNodeId);

  const duplicateNode = () => {
    if (!node) {
      return;
    }

    const id = `${node.id}-copy-${workflow.nodes.length + 1}`;
    setNodes([...workflow.nodes, { ...node, id, label: `${node.label} Copy` }]);
    selectNode(id);
  };

  const openSkillSource = () => {
    if (!node) {
      return;
    }

    if (!node.skillContent && node.skillRef && /^https?:\/\//i.test(node.skillRef)) {
      window.open(node.skillRef, '_blank', 'noopener,noreferrer');
      return;
    }

    const source = node.skillContent ?? `# ${node.label}\n\nSkill reference: ${node.skillRef ?? 'No SKILL.md source configured.'}\n`;
    const blob = new Blob([source], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const deleteNode = () => {
    if (!node) {
      return;
    }

    setNodes(workflow.nodes.filter((item) => item.id !== node.id));
    setEdges(workflow.edges.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    selectNode(undefined);
  };

  if (!node) {
    return (
      <aside className={`panel inspector ${collapsed ? 'inspector--collapsed' : ''}`} aria-expanded={!collapsed}>
        <div className="panel__heading">
          <h2>{t('inspector.emptyTitle')}</h2>
          <button
            type="button"
            className="panel__collapse"
            aria-label={collapsed ? 'Expand skill editor' : 'Collapse skill editor'}
            onClick={onToggleCollapse}
          >
            {collapsed ? '⌃' : '⌄'}
          </button>
        </div>
        <div className="inspector__content" hidden={collapsed}>
          <div className="inspector__empty">
            <Layers3 size={32} />
            <p>{t('inspector.emptyBody')}</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`panel inspector ${collapsed ? 'inspector--collapsed' : ''}`} aria-expanded={!collapsed}>
      <div className="panel__heading">
        <h2>{t('inspector.title')}</h2>
        <button
          type="button"
          className="panel__collapse"
          aria-label={collapsed ? 'Expand skill editor' : 'Collapse skill editor'}
          onClick={onToggleCollapse}
        >
          {collapsed ? '⌃' : '⌄'}
        </button>
      </div>
      <div className="inspector__content" hidden={collapsed}>
        <div className="inspector__editing">
          <span><Target size={20} /> Editing</span>
          <strong>{node.label}</strong>
          <span className="inspector__ready">Ready</span>
        </div>
        <SourceEditor key={node.id} node={node} updateNode={updateNode} />
        <button type="button" className="inspector__open-skill" onClick={openSkillSource}>
          Open SKILL.md <ExternalLink size={15} />
        </button>
        <div className="inspector__actions">
          <button type="button" onClick={duplicateNode}><Copy size={16} /> Duplicate</button>
          <button type="button" className="inspector__delete" onClick={deleteNode}><Trash2 size={16} /> Delete</button>
        </div>
        <div className="inspector__notice">
          <Info size={18} />
          <span>Changes are saved automatically and reflected in the workflow.</span>
        </div>
      </div>
    </aside>
  );
}
