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
  | 'inspector.skillSource'
  | 'inspector.skillSourceHelp'
  | 'inspector.skillRefMode'
  | 'inspector.skillContentMode'
  | 'inspector.skillRef'
  | 'inspector.skillRefPlaceholder'
  | 'inspector.skillContent'
  | 'inspector.skillContentHelp'
  | 'inspector.useTemplate'
  | 'inspector.detectedMetadata'
  | 'inspector.noDescription';

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
    'inspector.emptyBody': 'Select a skill node to edit its source. The name and description are read from SKILL.md or the reference link automatically.',
    'inspector.skillSource': 'Skill source',
    'inspector.skillSourceHelp': 'Choose either a reference link or inline SKILL.md content. Name and description are detected automatically.',
    'inspector.skillRefMode': 'Reference link',
    'inspector.skillContentMode': 'Write SKILL.md here',
    'inspector.skillRef': 'Skill reference link',
    'inspector.skillRefPlaceholder': 'https://github.com/org/repo/tree/main/skills/some-skill',
    'inspector.skillContent': 'SKILL.md content',
    'inspector.skillContentHelp': 'Start from the my-skill template or paste SKILL.md content. Frontmatter is used for the node name and description.',
    'inspector.useTemplate': 'Use my-skill template',
    'inspector.detectedMetadata': 'Detected metadata',
    'inspector.noDescription': 'No description detected yet.',
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
    'inspector.emptyBody': '请选择一个 skill 节点编辑来源。名称和描述会从 SKILL.md 或引用链接自动读取。',
    'inspector.skillSource': 'Skill 来源',
    'inspector.skillSourceHelp': '选择引用链接或直接编写 SKILL.md；名称和描述会自动识别。',
    'inspector.skillRefMode': '引用链接',
    'inspector.skillContentMode': '直接编写 SKILL.md',
    'inspector.skillRef': 'Skill 引用链接',
    'inspector.skillRefPlaceholder': 'https://github.com/org/repo/tree/main/skills/some-skill',
    'inspector.skillContent': 'SKILL.md 内容',
    'inspector.skillContentHelp': '从 my-skill 模版开始，或粘贴 SKILL.md 内容。节点名称和描述会读取 frontmatter。',
    'inspector.useTemplate': '使用 my-skill 模版',
    'inspector.detectedMetadata': '自动识别的元数据',
    'inspector.noDescription': '尚未识别到描述。',
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
