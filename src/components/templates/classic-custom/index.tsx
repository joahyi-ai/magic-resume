import React from "react";
import { ResumeData } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import BaseInfo from "./sections/BaseInfo";
import EducationSection from "./sections/EducationSection";
import ProjectSection from "./sections/ProjectSection";
import CustomSection from "./sections/CustomSection";
import SectionTitle from "./sections/SectionTitle";
import SectionWrapper from "../shared/SectionWrapper";
import CertificatesSection from "../shared/CertificatesSection";


interface ClassicCustomTemplateProps {
    data: ResumeData;
    template: ResumeTemplate;
}

const ClassicCustomTemplate: React.FC<ClassicCustomTemplateProps> = ({ data, template }) => {
    const { colorScheme } = template;
    const enabledSections = data.menuSections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);

    const selfEvaluationSection = enabledSections.find((s) => s.id === "selfEvaluation");
    const visibleSections = enabledSections.filter((section) => !["selfEvaluation", "experience", "skills"].includes(section.id));

    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case "basic":
                return (
                    <BaseInfo
                        basic={data.basic}
                        globalSettings={data.globalSettings}
                        template={template}
                        selfEvaluationContent={selfEvaluationSection ? data.selfEvaluationContent : undefined}
                    />
                );
            case "education":
                return <EducationSection education={data.education} globalSettings={data.globalSettings} />;
            case "projects":
                return <ProjectSection projects={data.projects} globalSettings={data.globalSettings} title="工作经历" />;
            case "certificates":
                return (
                    <SectionWrapper sectionId="certificates" style={{ marginTop: `${data.globalSettings?.sectionSpacing || 24}px` }}>
                        <SectionTitle type="certificates" globalSettings={data.globalSettings} />
                        <CertificatesSection certificates={data.certificates} />
                    </SectionWrapper>
                );
            default:
                if (sectionId in data.customData) {
                    const sectionTitle = data.menuSections.find((s) => s.id === sectionId)?.title || sectionId;
                    return <CustomSection title={sectionTitle} sectionId={sectionId} items={data.customData[sectionId]} globalSettings={data.globalSettings} />;
                }
                return null;
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen" style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
            {visibleSections.map((section) => (
                <div key={section.id}>{renderSection(section.id)}</div>
            ))}
        </div>
    );
};

export default ClassicCustomTemplate;
