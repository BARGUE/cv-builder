"use client";

import { useTranslations } from "next-intl";
import { ACCENT_COLORS } from "@/src/lib/utils";
import { TEMPLATE_IDS } from "@/src/types/cv";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { ScaledPreview } from "@/src/components/cv/ScaledPreview";
import type { TemplateModalProps } from "@/src/components/cv/types";

const TemplateModal = ({ showTemplateModal, setShowTemplateModal, cvData, setValue }: TemplateModalProps) => {
    const t = useTranslations("cvEditor");
    const tTemplates = useTranslations("templates");
    const tColors = useTranslations("accentColors");
    const isPresetColor = ACCENT_COLORS.some(c => c.value === cvData.accentColor);

    return (
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
            <DialogContent className="w-[calc(100vw-1.5rem)] max-w-4xl max-h-[90dvh] flex flex-col p-4 sm:p-6 rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">{t("changeTemplate")}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 py-2 pr-1">
                        {TEMPLATE_IDS.map(id => (
                            <Button
                                key={id}
                                type="button"
                                variant="outline"
                                onClick={() => { setValue("template", id, { shouldDirty: true }); setShowTemplateModal(false); }}
                                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all h-auto ${cvData.template === id
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <ScaledPreview data={{ ...cvData, template: id }} className="rounded-xl" />
                                <span className={`text-xs sm:text-sm font-bold whitespace-normal ${cvData.template === id ? 'text-primary' : 'text-foreground'}`}>
                                    {tTemplates(id)}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-border pt-4">
                    <p className="text-sm font-bold mb-3">{t("accentColor")}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {ACCENT_COLORS.map(c => (
                            <Button
                                key={c.value}
                                type="button"
                                variant="ghost"
                                size="icon"
                                title={tColors(c.key)}
                                aria-label={tColors(c.key)}
                                onClick={() => setValue("accentColor", c.value, { shouldDirty: true })}
                                className="h-8 w-8 rounded-full border-2 transition-all hover:scale-110 p-0"
                                style={{
                                    backgroundColor: c.value,
                                    borderColor: cvData.accentColor === c.value ? 'white' : c.value,
                                    outline: cvData.accentColor === c.value ? `3px solid ${c.value}` : 'none',
                                    outlineOffset: '2px',
                                }}
                            />
                        ))}
                        <div className="relative h-8 w-8">
                            <input type="color" value={cvData.accentColor} onChange={(e) => setValue("accentColor", e.target.value, { shouldDirty: true })} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                            <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground text-xs font-bold hover:border-foreground transition-colors"
                                style={{ backgroundColor: isPresetColor ? 'transparent' : cvData.accentColor }}>
                                {isPresetColor ? '+' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateModal;
