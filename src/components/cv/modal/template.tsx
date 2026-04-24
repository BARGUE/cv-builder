import { TEMPLATES, ACCENT_COLORS } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import CVPreview from "@/src/components/cv/Preview";
import type { TemplateModalProps } from "@/src/components/cv/types";

const TemplateModal = ({ showTemplateModal, setShowTemplateModal, cvData, setValue }: TemplateModalProps) => {
    return (
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
            <DialogContent aria-describedby="template-modal-description" className="max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">Changer de modèle</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="grid grid-cols-3 gap-4 py-2 pr-1">
                        {TEMPLATES.map(t => (
                            <Button
                                key={t.id}
                                type="button"
                                variant="outline"
                                onClick={() => { setValue("template", t.id, { shouldDirty: true }); setShowTemplateModal(false); }}
                                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all h-auto ${cvData.template === t.id
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/40'
                                    }`}
                            >
                                <div className="rounded-xl overflow-hidden w-full relative" style={{ aspectRatio: '595 / 842' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '595px', transformOrigin: 'top left', transform: 'scale(var(--preview-scale))', pointerEvents: 'none' }} ref={(el) => { if (el) { const parent = el.parentElement; if (parent) { const s = parent.offsetWidth / 595; el.style.setProperty('--preview-scale', String(s)); } } }}>
                                        <CVPreview data={{ ...cvData, template: t.id }} />
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${cvData.template === t.id ? 'text-primary' : 'text-foreground'}`}>
                                    {t.label}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-border pt-4">
                    <p className="text-sm font-bold mb-3">Couleur d'accent</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {ACCENT_COLORS.map(c => (
                            <Button
                                key={c.value}
                                type="button"
                                variant="ghost"
                                size="icon"
                                title={c.label}
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
                                style={{ backgroundColor: ACCENT_COLORS.some(c => c.value === cvData.accentColor) ? 'transparent' : cvData.accentColor }}>
                                {ACCENT_COLORS.some(c => c.value === cvData.accentColor) ? '+' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateModal;