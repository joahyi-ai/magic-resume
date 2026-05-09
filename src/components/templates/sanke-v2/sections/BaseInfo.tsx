import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BasicInfo, getBorderRadiusValue, GlobalSettings } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import SectionWrapper from "../../shared/SectionWrapper";
import GithubContribution from "@/components/shared/GithubContribution";
import { hasMeaningfulRichTextContent, normalizeRichTextContent } from "@/lib/richText";

interface BaseInfoProps {
    basic: BasicInfo | undefined;
    globalSettings: GlobalSettings | undefined;
    template?: ResumeTemplate;
    selfEvaluationContent?: string;
}

const BaseInfo = ({ basic = {} as BasicInfo, globalSettings, template, selfEvaluationContent }: BaseInfoProps) => {
    const layout = basic?.layout || "right";
    const shouldShowSummary = hasMeaningfulRichTextContent(selfEvaluationContent);

    const getOrderedFields = React.useMemo(() => {
        if (!basic.fieldOrder) {
            return [{ key: "email", value: basic.email, visible: true }]
                .filter((item) => Boolean(item.value && item.visible));
        }
        return basic.fieldOrder
            .filter((field) => field.visible !== false && field.key !== "name" && field.key !== "title")
            .map((field) => ({
                key: field.key,
                value: basic[field.key] as string,
                visible: field.visible,
            }))
            .filter((item) => Boolean(item.value));
    }, [basic]);

    const contactFields = getOrderedFields
        .filter((field) => field.key === "email" || field.key === "phone")
        .map((field) => ({
            ...field,
            value: field.key === "phone" && !String(field.value).includes("微信")
                ? `${field.value}(同微信)`
                : field.value,
        }));
    const summaryField = shouldShowSummary
        ? { key: "selfEvaluation", value: selfEvaluationContent }
        : null;

    const nameField = basic.fieldOrder?.find((f) => f.key === "name") || { key: "name", label: "姓名", visible: true };
    const titleField = basic.fieldOrder?.find((f) => f.key === "title") || { key: "title", label: "职位", visible: true };

    const photoWidth = basic.photoConfig?.width || 160;
    const photoHeight = basic.photoConfig?.height || 200;
    const PhotoComponent = basic.photo && basic.photoConfig?.visible && (
        <motion.div layout="position">
            <div
                style={{
                    width: `${photoWidth}px`,
                    height: `${photoHeight}px`,
                    borderRadius: getBorderRadiusValue({
                        borderRadius: "none",
                        customBorderRadius: basic.photoConfig?.customBorderRadius || 0,
                    }),
                    overflow: "hidden",
                }}
            >
                <img src={basic.photo} alt={`${basic.name}'s photo`} className="w-full h-full object-cover" />
            </div>
        </motion.div>
    );

    const layoutStyles = {
        left: { container: "flex items-start justify-between gap-8", leftContent: "flex flex-1 flex-col min-w-0", photoWrap: "shrink-0", nameTitle: "text-left min-w-0" },
        right: { container: "flex items-start justify-between gap-8", leftContent: "flex flex-1 flex-col min-w-0", photoWrap: "shrink-0", nameTitle: "text-left min-w-0" },
        center: { container: "flex items-start justify-between gap-8", leftContent: "flex flex-1 flex-col min-w-0", photoWrap: "shrink-0", nameTitle: "text-left min-w-0" },
    };

    const styles = layoutStyles[layout as keyof typeof layoutStyles] || layoutStyles.left;

    return (
        <SectionWrapper sectionId="basic">
            <div className={styles.container}>
                <div className={styles.leftContent}>
                    <div className={cn("flex flex-col", styles.nameTitle)}>
                        {nameField.visible !== false && basic[nameField.key] && (
                            <motion.h1 layout="position" className="font-bold leading-tight whitespace-normal break-normal [overflow-wrap:normal]" style={{ fontSize: "24px" }}>
                                {basic[nameField.key] as string}
                            </motion.h1>
                        )}
                    </div>
                    {(titleField.visible !== false && basic[titleField.key] || contactFields.length > 0) && (
                        <motion.div layout="position" className="mt-1.5 flex items-center gap-2 text-baseFont font-normal whitespace-nowrap" style={{ fontSize: `${(globalSettings?.baseFontSize || 14) + 1}px` }}>
                            {titleField.visible !== false && basic[titleField.key] && (
                                <span className="min-w-0 [overflow-wrap:anywhere]">{basic[titleField.key] as string}</span>
                            )}
                            {contactFields.map((item, index) => (
                                <React.Fragment key={item.key}>
                                    <span className="px-1">•</span>
                                    {item.key === "email" ? (
                                        <a href={`mailto:${item.value}`} className="min-w-0 [overflow-wrap:anywhere]">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span className="min-w-0 [overflow-wrap:anywhere]">
                                            {item.value}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    )}
                    {summaryField && (
                        <motion.div layout="position" className="mt-2 min-w-0 text-baseFont" style={{ fontSize: `${globalSettings?.baseFontSize || 14}px` }}>
                            <div
                                className="min-w-0 [overflow-wrap:anywhere] [&_p]:m-0 [&_ul]:m-0 [&_ul]:pl-4"
                                style={{ lineHeight: 1.5 }}
                                dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(summaryField.value) }}
                            />
                        </motion.div>
                    )}
                </div>
                <div className={styles.photoWrap}>
                    {PhotoComponent}
                </div>
            </div>
            {basic.githubContributionsVisible && (
                <GithubContribution className="mt-2" githubKey={basic.githubKey} username={basic.githubUseName} />
            )}
        </SectionWrapper>
    );
};

export default BaseInfo;
