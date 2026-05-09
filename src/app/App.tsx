import { NodeInspector } from '../components/NodeInspector';
import { SkillCanvas } from '../components/SkillCanvas';
import { SkillPalette } from '../components/SkillPalette';
import { WorkflowToolbar } from '../components/WorkflowToolbar';
import './styles.css';

export function App() {
  return (
    <main className="app-shell">
      <WorkflowToolbar />
      <section className="workspace">
        <SkillPalette />
        <div className="canvas-shell">
          <SkillCanvas />
        </div>
        <NodeInspector />
      </section>
    </main>
  );
}
