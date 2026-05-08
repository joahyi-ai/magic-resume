import { DEFAULT_TEMPLATES } from "@/config";
import {
  initialResumeState,
  initialResumeStateEn,
} from "@/config/initialResumeData";
import type { ResumeData } from "@/types/resume";
import type { ResumeTemplate } from "@/types/template";

export const TEMPLATE_PREVIEW_WIDTH_PX = 794;
export const TEMPLATE_PREVIEW_HEIGHT_PX = 1123;
export const TEMPLATE_SNAPSHOT_VERSION = 1;
export const TEMPLATE_SNAPSHOT_ROOT_ATTRIBUTE = "data-template-snapshot-root";
export const TEMPLATE_SNAPSHOT_ROOT_SELECTOR = `[${TEMPLATE_SNAPSHOT_ROOT_ATTRIBUTE}]`;
export const TEMPLATE_SNAPSHOT_PUBLIC_DIR = "template-snapshots";
export const TEMPLATE_PREVIEW_LOCALES = ["zh", "en"] as const;

export type TemplatePreviewLocale = (typeof TEMPLATE_PREVIEW_LOCALES)[number];

export interface TemplateSnapshotManifest {
  version: number;
  generatedAt: string | null;
  locales: Record<TemplatePreviewLocale, Record<string, string>>;
}

export const createEmptyTemplateSnapshotManifest =
  (): TemplateSnapshotManifest => ({
    version: TEMPLATE_SNAPSHOT_VERSION,
    generatedAt: null,
    locales: {
      zh: {},
      en: {},
    },
  });

export const isTemplatePreviewLocale = (
  value: string | null | undefined
): value is TemplatePreviewLocale =>
  value === "zh" || value === "en";

export const getTemplateById = (templateId: string | undefined): ResumeTemplate =>
  DEFAULT_TEMPLATES.find((template) => template.id === templateId) ??
  DEFAULT_TEMPLATES[0];

export const getTemplatePreviewBaseData = (locale: TemplatePreviewLocale) =>
  locale === "en" ? initialResumeStateEn : initialResumeState;

export const createTemplatePreviewData = (
  template: ResumeTemplate,
  locale: TemplatePreviewLocale
): ResumeData => {
  const baseData = getTemplatePreviewBaseData(locale);
  const isSankeTemplate = template.id === "sanke";
  const isSankeV2Template = template.id === "sanke-v2";
  const sankeBasicFieldKeys = new Set(["name", "title", "email", "phone"]);
  const basic = isSankeTemplate || isSankeV2Template
    ? {
        ...baseData.basic,
        fieldOrder: baseData.basic.fieldOrder?.filter((field) =>
          sankeBasicFieldKeys.has(field.key)
        ),
        customFields: [],
        githubContributionsVisible: false,
      }
    : {
        ...baseData.basic,
      };
  const menuSections = isSankeV2Template
    ? baseData.menuSections.map((section) => {
        const sectionOrderMap: Record<string, number> = {
          basic: 0,
          selfEvaluation: 1,
          projects: 2,
          experience: 3,
          skills: 4,
          education: 5,
        };
        return {
          ...section,
          order: sectionOrderMap[section.id] ?? section.order,
        };
      })
    : baseData.menuSections;

  return {
    ...baseData,
    id: `preview-mock-${locale}-${template.id}`,
    templateId: template.id,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    globalSettings: {
      ...baseData.globalSettings,
      themeColor: template.colorScheme.primary,
      sectionSpacing: template.spacing.sectionGap,
      paragraphSpacing: template.spacing.itemGap,
      pagePadding: template.spacing.contentPadding,
    },
    basic: {
      ...basic,
      layout: template.basic.layout,
    },
    menuSections,
  } as ResumeData;
};

export const getTemplateSnapshotPath = (
  locale: TemplatePreviewLocale,
  templateId: string
) => `/${TEMPLATE_SNAPSHOT_PUBLIC_DIR}/${locale}/${templateId}.png`;

export const getTemplateSnapshotSrc = (
  manifest: TemplateSnapshotManifest,
  locale: TemplatePreviewLocale,
  templateId: string
) => manifest.locales[locale][templateId] ?? null;
