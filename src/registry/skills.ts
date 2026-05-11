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

export const reusableSkills: SkillMetadata[] = [
  {
    name: 'intake-discovery',
    displayName: 'Intake Discovery',
    description: 'Capture the user goal, context, constraints, and acceptance criteria before planning.',
    source: 'local',
    version: '0.1.0',
    tags: ['discovery', 'intake', 'requirements'],
    path: 'skills/catalog/intake-discovery/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'solution-design',
    displayName: 'Solution Design',
    description: 'Compare viable approaches and select a plan that fits the workflow constraints.',
    source: 'local',
    version: '0.1.0',
    tags: ['planning', 'design'],
    path: 'skills/catalog/solution-design/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'implementation',
    displayName: 'Implementation',
    description: 'Make focused changes while keeping progress, assumptions, and risks visible.',
    source: 'local',
    version: '0.1.0',
    tags: ['implementation', 'build'],
    path: 'skills/catalog/implementation/SKILL.md',
    nodeType: 'skill',
  },
  {
    name: 'quality-review',
    displayName: 'Quality Review',
    description: 'Review correctness, maintainability, edge cases, and user-visible behavior before handoff.',
    source: 'local',
    version: '0.1.0',
    tags: ['review', 'quality', 'verification'],
    path: 'skills/catalog/quality-review/SKILL.md',
    nodeType: 'verification',
  },
  {
    name: 'release-handoff',
    displayName: 'Release Handoff',
    description: 'Summarize outcomes, checks, limitations, and follow-up actions for the next operator.',
    source: 'local',
    version: '0.1.0',
    tags: ['handoff', 'release', 'summary'],
    path: 'skills/catalog/release-handoff/SKILL.md',
    nodeType: 'verification',
  },
];

export function searchSkills(query: string, skills = reusableSkills): SkillMetadata[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return skills;
  }

  return skills.filter((skill) => {
    const haystack = [skill.name, skill.displayName, skill.description, ...skill.tags].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}
