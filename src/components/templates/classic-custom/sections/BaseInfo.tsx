import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { BasicInfo, getBorderRadiusValue, GlobalSettings } from "@/types/resume";
import { ResumeTemplate } from "@/types/template";
import SectionWrapper from "../../shared/SectionWrapper";
import { hasMeaningfulRichTextContent, normalizeRichTextContent } from "@/lib/richText";

interface BaseInfoProps {
    basic: BasicInfo | undefined;
    globalSettings: GlobalSettings | undefined;
    template?: ResumeTemplate;
    selfEvaluationContent?: string;
}

const BaseInfo = ({ basic = {} as BasicInfo, globalSettings, template, selfEvaluationContent }: BaseInfoProps) => {
    const useIconMode = globalSettings?.useIconMode ?? false;
    const layout = basic?.layout || "left";
    const shouldShowSummary = hasMeaningfulRichTextContent(selfEvaluationContent);

    const getIcon = (iconName: string | undefined) => {
        const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
        return IconComponent ? <IconComponent className="mt-[0.2em] h-4 w-4 shrink-0" /> : null;
    };

    const isFieldVisible = (key: keyof BasicInfo) => {
        const field = basic.fieldOrder?.find((item) => item.key === key);
        return field?.visible !== false;
    };

    const orderedFieldsWithSummary = [
        ...(basic.email && isFieldVisible("email") ? [{ key: "email", value: basic.email, icon: basic.icons?.email || "Mail" }] : []),
        ...(basic.phone && isFieldVisible("phone") ? [{ key: "phone", value: `${basic.phone} (同微信)`, icon: basic.icons?.phone || "Phone" }] : []),
        ...(shouldShowSummary ? [{ key: "selfEvaluation", value: selfEvaluationContent, icon: "FileText" }] : []),
    ];

    const nameField = basic.fieldOrder?.find((f) => f.key === "name") || { key: "name", label: "姓名", visible: true };
    const titleField = basic.fieldOrder?.find((f) => f.key === "title") || { key: "title", label: "职位", visible: true };

    const PhotoComponent = basic.photo && basic.photoConfig?.visible && (
        <motion.div layout="position">
            <div style={{ width: `${basic.photoConfig?.width || 100}px`, height: `${basic.photoConfig?.height || 100}px`, borderRadius: getBorderRadiusValue(basic.photoConfig || { borderRadius: "none", customBorderRadius: 0 }), overflow: "hidden" }}>
                <img src={basic.photo} alt={`${basic.name}'s photo`} className="w-full h-full object-cover" />
            </div>
        </motion.div>
    );

    const layoutStyles = {
        left: { container: "flex items-center justify-between gap-6", leftContent: "flex items-center gap-6 shrink-0 min-w-0 max-w-[42%]", fields: "grid flex-1 min-w-0 grid-cols-2 gap-x-6 gap-y-2 justify-start", nameTitle: "text-left min-w-0 max-w-[16rem] flex-1" },
        right: { container: "flex items-center justify-between gap-6 flex-row-reverse", leftContent: "flex flex-row-reverse justify-start items-center gap-6 shrink-0 min-w-0 max-w-[42%]", fields: "grid flex-1 min-w-0 grid-cols-2 gap-x-6 gap-y-2 justify-start", nameTitle: "text-right min-w-0 max-w-[16rem] flex-1" },
        center: { container: "flex flex-col items-center gap-3", leftContent: "flex flex-col items-center gap-4", fields: "w-full flex justify-center items-center flex-wrap gap-3", nameTitle: "text-center min-w-0 max-w-full" },
    };

    const styles = layoutStyles[layout as keyof typeof layoutStyles] || layoutStyles.left;

    return (
        <SectionWrapper sectionId="basic">
            <div className={styles.container}>
                <div className={styles.leftContent}>
                    {PhotoComponent}
                    <div className={cn("flex flex-col", styles.nameTitle)}>
                        {nameField.visible !== false && basic[nameField.key] && (
                            <motion.h1 layout="position" className="font-bold whitespace-normal break-normal [overflow-wrap:normal]" style={{ fontSize: "30px" }}>{basic[nameField.key] as string}</motion.h1>
                        )}
                        {titleField.visible !== false && basic[titleField.key] && (
                            <motion.h2 layout="position" className="whitespace-normal break-normal [overflow-wrap:normal]" style={{ fontSize: "18px" }}>{basic[titleField.key] as string}</motion.h2>
                        )}
                    </div>
                </div>
                <motion.div layout="position" className={styles.fields} style={{ fontSize: `${globalSettings?.baseFontSize || 14}px`, color: "rgb(75, 85, 99)", maxWidth: layout === "center" ? "none" : "600px" }}>
                    {orderedFieldsWithSummary.map((item) => {
                        if (item.key === "selfEvaluation") {
                            return (
                                <motion.div
                                    key={item.key}
                                    className={cn("flex min-w-0 items-start text-baseFont", layout !== "center" && "col-span-2")}
                                >
                                    {useIconMode ? (
                                        <div className="flex min-w-0 items-start gap-1">
                                            {getIcon(item.icon)}
                                            <div
                                                className="min-w-0 [overflow-wrap:anywhere] [&_p]:m-0 [&_ul]:m-0 [&_ul]:pl-4"
                                                style={{ lineHeight: globalSettings?.lineHeight || 1.6 }}
                                                dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(item.value) }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex min-w-0 items-start">
                                            <div
                                                className="min-w-0 [overflow-wrap:anywhere] [&_p]:m-0 [&_ul]:m-0 [&_ul]:pl-4"
                                                style={{ lineHeight: globalSettings?.lineHeight || 1.6 }}
                                                dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(item.value) }}
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        }

                        return (
                        <motion.div key={item.key} className="flex min-w-0 items-start text-baseFont">
                            {useIconMode ? (
                                <div className="flex min-w-0 items-start gap-1">
                                    {getIcon(item.icon)}
                                    {item.key === "email" ? <a href={`mailto:${item.value}`} className="min-w-0 underline [overflow-wrap:anywhere]">{item.value}</a> : <span className="min-w-0 [overflow-wrap:anywhere]">{item.value}</span>}
                                </div>
                            ) : (
                                <div className="flex min-w-0 items-start">
                                    <span className="min-w-0 [overflow-wrap:anywhere]" suppressHydrationWarning>{item.value}</span>
                                </div>
                            )}
                        </motion.div>
                    )})}
                </motion.div>
            </div>
        </SectionWrapper>
    );
};

export default BaseInfo;
