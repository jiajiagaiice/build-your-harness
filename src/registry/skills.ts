import { SkillNodeType } from '../schema/workflow';

export type SkillMetadata = {
  name: string;
  displayName: string;
  description: string;
  source: 'local' | 'github' | 'generated';
  version: string;
  tags: string[];
  path: string;
  nodeType: SkillNodeType;
};

export const developmentSkills: SkillMetadata[] = [
  {
    name: 'using-superpowers',
    displayName: 'Use Superpowers',
    description: 'Start by identifying the skills needed for the task and loading only the relevant instructions.',
    source: 'local',
    version: '0.1.0',
    tags: ['development', 'harness', 'entry'],
    path: 'skills/development-superpowers/using-superpowers/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'brainstorming',
    displayName: 'Brainstorming',
    description: 'Clarify intent, constraints, risks, and success criteria before implementation.',
    source: 'local',
    version: '0.1.0',
    tags: ['discovery', 'planning'],
    path: 'skills/development-superpowers/brainstorming/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'writing-plans',
    displayName: 'Writing Plans',
    description: 'Convert a chosen approach into a concrete implementation plan with validation checkpoints.',
    source: 'local',
    version: '0.1.0',
    tags: ['planning'],
    path: 'skills/development-superpowers/writing-plans/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'executing-plans',
    displayName: 'Executing Plans',
    description: 'Work through the plan incrementally, keeping state and validation visible.',
    source: 'local',
    version: '0.1.0',
    tags: ['implementation'],
    path: 'skills/development-superpowers/executing-plans/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'test-driven-development',
    displayName: 'Test Driven Development',
    description: 'Prefer tests and checks before or alongside behavior changes.',
    source: 'local',
    version: '0.1.0',
    tags: ['testing', 'quality'],
    path: 'skills/development-superpowers/test-driven-development/SKILL.md',
    nodeType: 'verification',
  },
  {
    name: 'requesting-code-review',
    displayName: 'Requesting Code Review',
    description: 'Run a structured self-review before handing off changes.',
    source: 'local',
    version: '0.1.0',
    tags: ['review', 'quality'],
    path: 'skills/development-superpowers/requesting-code-review/SKILL.md',
    nodeType: 'verification',
  },
  {
    name: 'verification-before-completion',
    displayName: 'Verification Before Completion',
    description: 'Finish with explicit checks, limitations, and completion notes.',
    source: 'local',
    version: '0.1.0',
    tags: ['verification', 'handoff'],
    path: 'skills/development-superpowers/verification-before-completion/SKILL.md',
    nodeType: 'verification',
  },
];

export function searchSkills(query: string, skills = developmentSkills): SkillMetadata[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return skills;
  }

  return skills.filter((skill) => {
    const haystack = [skill.name, skill.displayName, skill.description, ...skill.tags].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}
