/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Language = 'en' | 'zh';

type TranslationKey =
  | 'app.title'
  | 'app.subtitle'
  | 'toolbar.validate'
  | 'toolbar.import'
  | 'toolbar.export'
  | 'toolbar.language'
  | 'toolbar.status.ready'
  | 'toolbar.status.valid'
  | 'toolbar.status.exported'
  | 'toolbar.status.imported'
  | 'palette.title'
  | 'palette.search'
  | 'palette.addSkill'
  | 'canvas.editHint'
  | 'inspector.title'
  | 'inspector.emptyTitle'
  | 'inspector.emptyBody'
  | 'inspector.label'
  | 'inspector.skillSource'
  | 'inspector.skillSourceHelp'
  | 'inspector.skillRefMode'
  | 'inspector.skillContentMode'
  | 'inspector.skillRef'
  | 'inspector.skillRefPlaceholder'
  | 'inspector.description'
  | 'inspector.skillContent'
  | 'inspector.skillContentHelp'
  | 'inspector.generateWithAi'
  | 'inspector.aiPrompt'
  | 'inspector.aiPromptHelp'
  | 'inspector.copyPrompt';

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
};

const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'app.title': 'Build Your Harness',
    'app.subtitle': 'Compose skill nodes into directed agent workflows.',
    'toolbar.validate': 'Validate',
    'toolbar.import': 'Import JSON',
    'toolbar.export': 'Export Harness',
    'toolbar.language': 'Language',
    'toolbar.status.ready': 'Ready',
    'toolbar.status.valid': 'Workflow is valid',
    'toolbar.status.exported': 'Exported {count} artifacts',
    'toolbar.status.imported': 'Imported {name}',
    'palette.title': 'Skill Palette',
    'palette.search': 'Search skills',
    'palette.addSkill': 'Add {name}',
    'canvas.editHint': 'Click a node to edit its metadata and skill source.',
    'inspector.title': 'Skill Editor',
    'inspector.emptyTitle': 'Skill Editor',
    'inspector.emptyBody': 'Select a visual skill node to edit its label, description, and skill source.',
    'inspector.label': 'Label',
    'inspector.skillSource': 'Skill source',
    'inspector.skillSourceHelp': 'Choose either a reference link or inline SKILL.md content. These two sources are mutually exclusive.',
    'inspector.skillRefMode': 'Reference link',
    'inspector.skillContentMode': 'Write SKILL.md here',
    'inspector.skillRef': 'Skill reference link',
    'inspector.skillRefPlaceholder': 'https://github.com/org/repo/tree/main/skills/some-skill',
    'inspector.description': 'Description',
    'inspector.skillContent': 'SKILL.md content',
    'inspector.skillContentHelp': 'Inline content is exported as a generated SKILL.md artifact and clears the reference link.',
    'inspector.generateWithAi': 'Generate draft with AI helper',
    'inspector.aiPrompt': 'AI assistant prompt',
    'inspector.aiPromptHelp': 'Copy this prompt into your AI assistant, then paste the generated skill content back into the editor.',
    'inspector.copyPrompt': 'Copy prompt',
  },
  zh: {
    'app.title': '构建你的 Harness',
    'app.subtitle': '将 skill 节点编排成有向的智能体工作流。',
    'toolbar.validate': '校验',
    'toolbar.import': '导入 JSON',
    'toolbar.export': '导出 Harness',
    'toolbar.language': '语言',
    'toolbar.status.ready': '已就绪',
    'toolbar.status.valid': '工作流校验通过',
    'toolbar.status.exported': '已导出 {count} 个产物',
    'toolbar.status.imported': '已导入 {name}',
    'palette.title': 'Skill 面板',
    'palette.search': '搜索 skill',
    'palette.addSkill': '添加 {name}',
    'canvas.editHint': '点击节点即可编辑元数据和 skill 来源。',
    'inspector.title': 'Skill 编辑器',
    'inspector.emptyTitle': 'Skill 编辑器',
    'inspector.emptyBody': '请选择一个可视化 skill 节点，以编辑名称、描述和 skill 来源。',
    'inspector.label': '名称',
    'inspector.skillSource': 'Skill 来源',
    'inspector.skillSourceHelp': '选择一种来源：填写引用链接，或直接编写 SKILL.md 内容；两者互斥。',
    'inspector.skillRefMode': '引用链接',
    'inspector.skillContentMode': '直接编写 SKILL.md',
    'inspector.skillRef': 'Skill 引用链接',
    'inspector.skillRefPlaceholder': 'https://github.com/org/repo/tree/main/skills/some-skill',
    'inspector.description': '描述',
    'inspector.skillContent': 'SKILL.md 内容',
    'inspector.skillContentHelp': '直接编写的内容会导出为生成的 SKILL.md 产物，并清空引用链接。',
    'inspector.generateWithAi': '用 AI 助手生成草稿',
    'inspector.aiPrompt': 'AI 助手提示词',
    'inspector.aiPromptHelp': '复制这段提示词到你的 AI 助手，再把生成的 skill 内容粘贴回编辑器。',
    'inspector.copyPrompt': '复制提示词',
  },
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, values) => interpolate(dictionaries[language][key], values),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

function interpolate(template: string, values: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
