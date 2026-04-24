"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import importSuccessImg from "@/public/assets/import-success.png";

const DoneConfirmation = ({ onContinue }: { fileName: string; onContinue: () => void }) => {
    const t = useTranslations("cvImport");
    const tCommon = useTranslations("common");

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-6"
        >
            <h1 className="text-2xl font-black tracking-tight text-center mb-2">
                {t("doneTitle")}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
                {t("doneSubtitle")}
            </p>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 180, damping: 14 }}
                className="mb-8"
            >
                <img src={importSuccessImg.src} alt={t("doneImageAlt")} className="w-64 h-auto mx-auto" />
            </motion.div>

            <Button onClick={onContinue} className="rounded-xl px-16 h-12 text-base font-semibold w-full max-w-xs">
                {tCommon("continue")}
            </Button>
        </motion.div>
    );
};

export default DoneConfirmation;
