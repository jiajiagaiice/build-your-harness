import { Download, ShieldCheck, Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { exportSkillHarness } from '../exporters/skillHarnessExporter';
import { HarnessWorkflowSchema, validateWorkflow } from '../schema/workflow';
import { useWorkflowStore } from '../store/workflowStore';

export function WorkflowToolbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { workflow, setWorkflow } = useWorkflowStore();
  const [message, setMessage] = useState('Ready');

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
    setMessage(`Exported ${result.artifacts.length} artifacts`);
  };

  const importWorkflow = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    const parsed = HarnessWorkflowSchema.parse(JSON.parse(text));
    setWorkflow(parsed);
    setMessage(`Imported ${parsed.name}`);
  };

  return (
    <header className="toolbar">
      <div>
        <h1>Build Your Harness</h1>
        <p>Compose skill nodes into directed agent workflows.</p>
      </div>
      <div className="toolbar__actions">
        <button type="button" onClick={() => setMessage(validation.valid ? 'Workflow is valid' : validation.errors.join('; '))}>
          <ShieldCheck size={16} /> Validate
        </button>
        <button type="button" onClick={() => inputRef.current?.click()}>
          <Upload size={16} /> Import JSON
        </button>
        <button type="button" onClick={exportWorkflow} disabled={!validation.valid}>
          <Download size={16} /> Export Harness
        </button>
        <input ref={inputRef} hidden type="file" accept="application/json" onChange={importWorkflow} />
        <span className={validation.valid ? 'status status--ok' : 'status status--error'}>{message}</span>
      </div>
    </header>
  );
}
