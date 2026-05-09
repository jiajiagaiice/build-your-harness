import { Download, ShieldCheck, Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { exportSkillHarness } from '../exporters/skillHarnessExporter';
import { useI18n, Language } from '../i18n';
import { HarnessWorkflowSchema, validateWorkflow } from '../schema/workflow';
import { useWorkflowStore } from '../store/workflowStore';

export function WorkflowToolbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { workflow, setWorkflow } = useWorkflowStore();
  const { language, setLanguage, t } = useI18n();
  const [message, setMessage] = useState(t('toolbar.status.ready'));

  const validation = validateWorkflow(workflow);

  const exportWorkflow = () => {
    const result = exportSkillHarness(workflow);
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${workflow.id}-harness-export.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(t('toolbar.status.exported', { count: result.artifacts.length }));
  };

  const importWorkflow = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const parsed = HarnessWorkflowSchema.parse(JSON.parse(text));
    setWorkflow(parsed);
    setMessage(t('toolbar.status.imported', { name: parsed.name }));
  };

  return (
    <header className="toolbar">
      <div>
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
      </div>
      <div className="toolbar__actions">
        <label className="toolbar__language">
          {t('toolbar.language')}
          <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
        <button type="button" onClick={() => setMessage(validation.valid ? t('toolbar.status.valid') : validation.errors.join('; '))}>
          <ShieldCheck size={16} /> {t('toolbar.validate')}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()}>
          <Upload size={16} /> {t('toolbar.import')}
        </button>
        <button type="button" onClick={exportWorkflow} disabled={!validation.valid}>
          <Download size={16} /> {t('toolbar.export')}
        </button>
        <input ref={inputRef} hidden type="file" accept="application/json" onChange={importWorkflow} />
        <span className={validation.valid ? 'status status--ok' : 'status status--error'}>{message}</span>
      </div>
    </header>
  );
}
