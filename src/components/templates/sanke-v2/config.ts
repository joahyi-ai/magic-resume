import { ResumeTemplate } from "@/types/template";

export const classicCustomConfig: ResumeTemplate = {
  id: "sanke-v2",
  name: "三科-v2",
  description: "基于经典模板复制的新模板，用于自定义修改",
  thumbnail: "sanke-v2",
  layout: "sanke-v2",
  colorScheme: {
    primary: "#000000",
    secondary: "#4b5563",
    background: "#ffffff",
    text: "#212529",
  },
  spacing: {
    sectionGap: 16,
    itemGap: 12,
    contentPadding: 32,
  },
  basic: {
    layout: "left",
  },
  availableSections: ["skills", "experience", "projects", "education", "selfEvaluation", "certificates"],
};
