import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import SectionWrapper from "../../shared/SectionWrapper";
import { GlobalSettings } from "@/types/resume";
import { normalizeRichTextContent } from "@/lib/richText";
import { cn } from "@/lib/utils";

interface SelfEvaluationSectionProps {
    content?: string;
    globalSettings?: GlobalSettings;
    showTitle?: boolean;
    variant?: "default" | "sidebar";
}

const SelfEvaluationSection = ({ content, globalSettings, showTitle = true, variant = "default" }: SelfEvaluationSectionProps) => {
    const isSidebar = variant === "sidebar";

    return (
        <SectionWrapper
            sectionId="selfEvaluation"
            className={cn(isSidebar && "hover:bg-white/10")}
            style={{ marginTop: isSidebar ? 0 : `${globalSettings?.sectionSpacing || 24}px` }}
        >
            <SectionTitle
                type="selfEvaluation"
                globalSettings={globalSettings}
                showTitle={showTitle}
                variant={variant}
            />
            <motion.div style={{ marginTop: isSidebar ? 0 : `${globalSettings?.paragraphSpacing}px` }}>
                <motion.div
                    className={cn("text-baseFont", isSidebar && "opacity-90")}
                    layout="position"
                    style={{
                        fontSize: `${isSidebar ? Math.max((globalSettings?.baseFontSize || 14) - 2, 12) : (globalSettings?.baseFontSize || 14)}px`,
                        lineHeight: globalSettings?.lineHeight || 1.6,
                        color: isSidebar ? "#ffffff" : "inherit",
                    }}
                    dangerouslySetInnerHTML={{ __html: normalizeRichTextContent(content) }}
                />
            </motion.div>
        </SectionWrapper>
    );
};

export default SelfEvaluationSection;
