import { useState } from 'react';
import { NodeInspector } from '../components/NodeInspector';
import { SkillCanvas } from '../components/SkillCanvas';
import { SkillPalette } from '../components/SkillPalette';
import { WorkflowToolbar } from '../components/WorkflowToolbar';
import './styles.css';

export function App() {
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  const workspaceClassName = [
    'workspace',
    isPaletteCollapsed ? 'workspace--palette-collapsed' : '',
    isInspectorCollapsed ? 'workspace--inspector-collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className="app-shell">
      <WorkflowToolbar />
      <section className={workspaceClassName}>
        <SkillPalette
          collapsed={isPaletteCollapsed}
          onToggleCollapse={() => setIsPaletteCollapsed((collapsed) => !collapsed)}
        />
        <div className="canvas-shell">
          <SkillCanvas />
        </div>
        <NodeInspector
          collapsed={isInspectorCollapsed}
          onToggleCollapse={() => setIsInspectorCollapsed((collapsed) => !collapsed)}
        />
      </section>
    </main>
  );
}
