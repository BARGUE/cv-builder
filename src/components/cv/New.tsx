'use client';

import CVPreview from "./Preview";
import { CVData, defaultCVData } from "@/src/types/cv";
import type { CVNewProps } from "@/src/components/cv/types";
import { Button } from "@/src/components/ui/button";
import {
  FileText, ChevronLeft, ChevronRight, Save, Check, Layers, Download,
  ArrowLeft, Briefcase, GraduationCap, Zap,
  AlignLeft, Settings, UserCircle
} from "lucide-react";
import { Step1Coordonnees } from "./step/Step1Coordonnees";
import { Step2Experiences } from "./step/Step2Experiences";
import { Step3Formation } from "./step/Step3Formation";
import { Step4Competences } from "./step/Step4Competences";
import { Step5Resume } from "./step/Step5Resume";
import { Step6Langues } from "./step/Step6Langues";
import { Step7Finaliser } from "./step/Step7Finaliser";
import { generatePdfFromNode } from "@/src/lib/pdf";
import { redirect, useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TEMPLATES } from "@/src/lib/utils";
import TemplateModal from "./modal/template";
import { useTranslations } from "next-intl";
import { createCvAction, updateCvAction } from "@/src/app/[locale]/actions/cv";
import { cvDataSchema } from "@/src/lib/validations/cv";
import { myToast } from "@/src/components/ui/toast";
import { AuthModal } from "@/src/components/auth/AuthModal";

const steps = [
  { num: 1, icon: UserCircle },
  { num: 2, icon: Briefcase },
  { num: 3, icon: GraduationCap },
  { num: 4, icon: Zap },
  { num: 5, icon: AlignLeft },
  { num: 6, icon: Layers },
  { num: 7, icon: Settings },
];

const getInitialFormValues = (
  id: string | undefined,
  initialCvId: string | undefined,
  initialCvData: CVData | null | undefined
): CVData => {
  if (id === initialCvId && initialCvData) return initialCvData;
  return defaultCVData;
};

const CV_PREVIEW_WIDTH = 595;
const CV_PREVIEW_HEIGHT = 842;
const PREVIEW_CONTAINER_WIDTH = 350;
const PREVIEW_CONTAINER_HEIGHT = 496;

const CVNew = ({ initialCvData, initialCvId, user }: CVNewProps) => {
  const t = useTranslations("cvEditor");
  const params = useParams<{ id?: string }>();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(() =>
    Math.min(PREVIEW_CONTAINER_WIDTH / CV_PREVIEW_WIDTH, PREVIEW_CONTAINER_HEIGHT / CV_PREVIEW_HEIGHT)
  );
  const id = params?.id && params.id !== "new" ? params.id : undefined;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const form = useForm<CVData>({
    resolver: zodResolver(cvDataSchema) as Resolver<CVData>,
    defaultValues: getInitialFormValues(id, initialCvId, initialCvData),
  });
  const { setValue, reset, watch, getValues, formState: { isDirty } } = form;
  const cvData = watch();

  useEffect(() => {
    // Only require auth when editing an existing CV
    if (!user && id) redirect("/");
    if (id !== initialCvId || !initialCvData) return;
    reset(initialCvData);
    setCurrentStep(Math.min(7, Math.max(1, initialCvData.currentStep ?? 1)));
  }, [id, initialCvId, initialCvData, reset, user]);

  useEffect(() => {
    if (id != null || !user) return;
    const fullName = [user.profile?.firstName, user.profile?.lastName]
      .filter(Boolean)
      .join(" ");
    if (fullName) setValue("fullName", fullName);
    if (user.email) setValue("email", user.email);
    if (user.profile?.avatarUrl) setValue("photoUrl", user.profile.avatarUrl);
  }, [id, user, setValue]);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) {
        setPreviewScale(Math.min(w / CV_PREVIEW_WIDTH, h / CV_PREVIEW_HEIGHT));
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!pdfRef.current) return;
    setDownloading(true);
    try {
      await generatePdfFromNode(pdfRef.current, { title: cvData.title ?? "CV" });
      myToast.success(t("toasts.pdfOk"));
    } catch (err) {
      console.error("PDF generation error:", err);
      myToast.error(t("toasts.pdfError"));
    } finally {
      setDownloading(false);
    }
  }, [cvData.title]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setValue("photoUrl", reader.result as string, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const saveCV = useCallback(async (data: CVData, targetId?: string): Promise<CVData | null> => {
    setSaving(true);
    try {
      const cvIdToUse = targetId ?? id;
      const result = cvIdToUse
        ? await updateCvAction(cvIdToUse, data)
        : await createCvAction(data);
      if (!result.success) {
        myToast.error(result.error);
        return null;
      }
      const saved = result.data;
      reset(saved);
      myToast.success(t("toasts.saved"));
      return saved;
    } finally {
      setSaving(false);
    }
  }, [id, reset]);

  const handleSave = async (param: "done" | "save") => {
    if (param === "done" && !user) {
      setShowAuthModal(true);
      return;
    }
    if (!isDirty) {
      if (param === "done") {
        if (!cvData.completed) {
          const dataToSave = { ...getValues(), currentStep: 7, completed: true };
          await saveCV(dataToSave, id);
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        myToast.warning(t("toasts.noChanges"));
      }
      return;
    }
    const dataToSave = { ...getValues(), currentStep, completed: param === "done" || cvData.completed === true };
    if (param === "done") {
      dataToSave.currentStep = 7;
    }
    const savedCv = await saveCV(dataToSave, id);
    if (savedCv) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (param === "done") {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };


  const progress = Math.round((currentStep / 7) * 100);

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-background px-6 h-14 flex items-center justify-between shrink-0">
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-tight">CVBuilder</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToDashboard")}
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-56 bg-[hsl(235,40%,14%)] flex flex-col shrink-0">
            <nav className="flex-1 py-6 px-3 space-y-1">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                const StepIcon = step.icon;
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    key={step.num}
                    onClick={() => step.num <= currentStep ? setCurrentStep(step.num) : undefined}
                    disabled={step.num > currentStep}
                    className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : isPast
                        ? 'text-white/60 hover:text-white hover:bg-white/5 cursor-pointer'
                        : 'text-white/25 cursor-not-allowed'
                      }`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : isPast
                        ? 'bg-white/15 text-white/80'
                        : 'bg-white/5 text-white/30'
                      }`}>
                      {isPast ? <Check className="h-3.5 w-3.5" /> : <StepIcon className="h-3.5 w-3.5" />}
                    </div>
                    <span className="leading-tight truncate">{t(`steps.${step.num - 1}.label`)}</span>
                  </Button>
                );
              })}
            </nav>

            <div className="px-4 pb-6">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">{t("progress")}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white/70">{progress}%</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto w-full px-8 lg:px-12 py-10 flex gap-8">
                <FormProvider {...form}>
                  <div className="flex-1 min-w-0">
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                          {t("stepBadge", { step: currentStep })}
                        </span>
                      </div>
                      <h1 className="text-2xl font-black tracking-tight">{t(`stepTitles.${currentStep}.title`)}</h1>
                      <p className="text-muted-foreground text-sm mt-1">{t(`stepTitles.${currentStep}.subtitle`)}</p>
                    </div>

                    {/* Step 1: Coordonnées */}
                    {currentStep === 1 && (
                      <Step1Coordonnees
                        handlePhotoUpload={handlePhotoUpload}
                        fileInputRef={fileInputRef}
                      />
                    )}

                    {/* Step 2: Expériences */}
                    {currentStep === 2 && <Step2Experiences />}

                    {/* Step 3: Formation */}
                    {currentStep === 3 && <Step3Formation />}

                    {/* Step 4: Compétences */}
                    {currentStep === 4 && <Step4Competences />}

                    {/* Step 5: Résumé */}
                    {currentStep === 5 && <Step5Resume />}

                    {/* Step 6: Langues */}
                    {currentStep === 6 && <Step6Langues />}

                    {/* Step 7: Finaliser */}
                    {currentStep === 7 && <Step7Finaliser templates={TEMPLATES} />}
                  </div>
                </FormProvider>

                {/* Preview mini */}
                <div className="hidden lg:flex flex-col shrink-0 sticky top-0 self-start" style={{ width: PREVIEW_CONTAINER_WIDTH }}>
                  <div
                    ref={previewContainerRef}
                    className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex items-start justify-start"
                    style={{ width: PREVIEW_CONTAINER_WIDTH, height: PREVIEW_CONTAINER_HEIGHT }}
                  >
                    <div
                      style={{
                        transform: `scale(${previewScale})`,
                        transformOrigin: 'top left',
                        width: CV_PREVIEW_WIDTH,
                        height: CV_PREVIEW_HEIGHT,
                        flexShrink: 0,
                        pointerEvents: 'none',
                      }}
                    >
                      <CVPreview data={cvData} />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full gap-2 rounded-xl"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <Layers className="h-4 w-4" />
                    {t("changeTemplate")}
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-card shrink-0">
              <div className="max-w-5xl mx-auto px-8 lg:px-12 py-3.5 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push("/dashboard")}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentStep > 1 ? t("footer.previous") : t("footer.dashboard")}
                </Button>
                <div className="flex items-center gap-3">
                  {/* {!stepValid && currentStep < 7 && (
                    <p className="text-xs text-destructive font-medium">Champs obligatoires manquants</p>
                  )} */}
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => handleSave('save')} disabled={saving}>
                    {saved ? <><Check className="h-3.5 w-3.5" /> {t("footer.saved")}</> : saving ? "..." : <><Save className="h-3.5 w-3.5" /> {t("footer.save")}</>}
                  </Button>
                  {currentStep < 7 ? (
                    <Button
                      size="sm"
                      className="rounded-xl gap-1.5 disabled:opacity-40"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    // disabled={!stepValid}
                    >
                      {t("footer.next")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="rounded-xl gap-1.5"
                        onClick={handleDownloadPDF}
                        disabled={downloading}>
                        <Download className="h-3.5 w-3.5" />
                        {downloading ? "..." : t("footer.pdf")}
                      </Button>
                      <Button size="sm" className="rounded-xl gap-1.5" onClick={() => handleSave('done')}>
                        {t("footer.finish")}
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '595px' }}>
        <div ref={pdfRef} style={{ width: '595px', fontFamily: 'Inter, sans-serif' }}>
          <CVPreview data={cvData} forPdf />
        </div>
      </div> 

      <TemplateModal showTemplateModal={showTemplateModal} setShowTemplateModal={setShowTemplateModal} cvData={cvData} setValue={setValue} />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          handleSave("done");
        }}
        context="finalize"
      />
    </>
  );
};

export default CVNew;
