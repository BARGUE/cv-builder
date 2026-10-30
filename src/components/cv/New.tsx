'use client';

import { ScaledPreview } from "./ScaledPreview";
import { createDefaultCVData, type CVData } from "@/src/types/cv";
import type { CVNewProps } from "@/src/components/cv/types";
import type { MeResponse } from "@/src/services/auth/types";
import { Button } from "@/src/components/ui/button";
import {
  FileText, ChevronLeft, ChevronRight, Save, Check, Layers, Download,
  ArrowLeft, Briefcase, GraduationCap, Zap,
  AlignLeft, Settings, UserCircle, Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Step1Coordonnees } from "./step/Step1Coordonnees";
import { Step2Experiences } from "./step/Step2Experiences";
import { Step3Formation } from "./step/Step3Formation";
import { Step4Competences } from "./step/Step4Competences";
import { Step5Resume } from "./step/Step5Resume";
import { Step6Langues } from "./step/Step6Langues";
import { Step7Finaliser } from "./step/Step7Finaliser";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TemplateModal from "./modal/template";
import { useTranslations } from "next-intl";
import { createCvAction, updateCvAction } from "@/src/app/[locale]/actions/cv";
import { cvDataSchema, STEP_FIELDS } from "@/src/lib/validations/cv";
import { resizeImageToDataUrl } from "@/src/lib/image";
import { myToast } from "@/src/components/ui/toast";
import { AuthModal } from "@/src/components/auth/AuthModal";
import { usePdfExport } from "./usePdfExport";

const steps = [
  { num: 1, icon: UserCircle },
  { num: 2, icon: Briefcase },
  { num: 3, icon: GraduationCap },
  { num: 4, icon: Zap },
  { num: 5, icon: AlignLeft },
  { num: 6, icon: Layers },
  { num: 7, icon: Settings },
] as const;
const LAST_STEP = steps.length;

const clampStep = (n: number | undefined) => Math.min(LAST_STEP, Math.max(1, n ?? 1));

/** Nouveau CV : pré-remplit l'identité depuis le profil de l'utilisateur connecté. */
function getInitialValues(initialCvData: CVData | null | undefined, user: MeResponse | null): CVData {
  if (initialCvData) return initialCvData;
  const data = createDefaultCVData();
  if (user) {
    data.fullName = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ");
    data.email = user.email ?? "";
    data.photoUrl = user.profile?.avatarUrl ?? "";
  }
  return data;
}

type SaveMode = "save" | "done";

const CVNew = ({ initialCvData, initialCvId, user }: CVNewProps) => {
  const t = useTranslations("cvEditor");
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvId, setCvId] = useState(initialCvId);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user));
  const [currentStep, setCurrentStep] = useState(() => clampStep(initialCvData?.currentStep));
  const [furthestStep, setFurthestStep] = useState(currentStep);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [pendingSave, setPendingSave] = useState<SaveMode | null>(null);
  const { exportPdf, exporting, pdfNode } = usePdfExport();

  const form = useForm<CVData>({
    resolver: zodResolver(cvDataSchema) as Resolver<CVData>,
    defaultValues: getInitialValues(initialCvData, user),
  });
  const { setValue, reset, watch, getValues, trigger, getFieldState, formState: { isDirty } } = form;
  const cvData = watch();

  const goToStep = (step: number) => {
    const next = clampStep(step);
    setCurrentStep(next);
    setFurthestStep((f) => Math.max(f, next));
  };

  const handleDownloadPDF = async () => {
    try {
      await exportPdf(getValues());
      myToast.success(t("toasts.pdfOk"));
    } catch (err) {
      console.error("PDF generation error:", err);
      myToast.error(t("toasts.pdfError"));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setValue("photoUrl", await resizeImageToDataUrl(file), { shouldDirty: true });
    } catch {
      myToast.error(t("toasts.photoError"));
    }
  };

  /** Renvoie à la première étape contenant une erreur ; true si tout est valide. */
  const validateAll = async (): Promise<boolean> => {
    if (await trigger()) return true;
    const firstInvalid = Object.entries(STEP_FIELDS).find(([, fields]) =>
      fields.some((f) => getFieldState(f).invalid)
    );
    if (firstInvalid) goToStep(Number(firstInvalid[0]));
    myToast.error(t("toasts.incomplete"));
    return false;
  };

  const handleSave = async (mode: SaveMode, authenticated = isAuthenticated) => {
    if (!authenticated) {
      setPendingSave(mode);
      return;
    }
    if (mode === "save" && cvId && !isDirty) {
      myToast.warning(t("toasts.noChanges"));
      return;
    }
    if (mode === "done" && !(await validateAll())) return;

    const data: CVData = {
      ...getValues(),
      currentStep: mode === "done" ? LAST_STEP : currentStep,
      completed: mode === "done" || getValues("completed") === true,
    };

    setSaving(true);
    try {
      const result = cvId ? await updateCvAction(cvId, data) : await createCvAction(data);
      if (!result.success) {
        if (result.code === "UNAUTHORIZED") {
          setIsAuthenticated(false);
          setPendingSave(mode);
        } else {
          myToast.error(result.error);
        }
        return;
      }
      reset(result.data);
      myToast.success(t("toasts.saved"));

      if (!cvId && result.data.id) {
        // Le CV existe désormais : les sauvegardes suivantes doivent le mettre à jour, pas en créer un nouveau.
        setCvId(result.data.id);
        window.history.replaceState(null, "", pathname.replace(/\/new$/, `/${result.data.id}`));
      }

      if (mode === "done") {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const progress = Math.round((currentStep / LAST_STEP) * 100);

  return (
    <>
      <div className="h-dvh bg-background flex flex-col">
        <header className="border-b border-border bg-background px-2 sm:px-6 h-14 flex items-center justify-between shrink-0">
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
            aria-label={t("backToDashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("backToDashboard")}</span>
          </Button>
        </header>

        {/* Mobile : étapes compactes + progression */}
        <div className="md:hidden border-b border-border bg-[hsl(235,40%,14%)] px-4 py-3 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-sm font-semibold text-white truncate">
              {t(`steps.${currentStep - 1}.label`)}
            </span>
            <span className="text-xs font-bold text-white/60 shrink-0">{currentStep} / {LAST_STEP}</span>
          </div>
          <div className="flex gap-1.5">
            {steps.map((step) => {
              const isReachable = step.num <= furthestStep;
              return (
                <button
                  key={step.num}
                  type="button"
                  disabled={!isReachable}
                  onClick={() => setCurrentStep(step.num)}
                  aria-label={t(`steps.${step.num - 1}.label`)}
                  aria-current={currentStep === step.num ? "step" : undefined}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${step.num <= currentStep
                    ? "bg-primary"
                    : isReachable
                      ? "bg-white/40"
                      : "bg-white/10"
                    }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden md:flex w-56 bg-[hsl(235,40%,14%)] flex-col shrink-0">
            <nav className="flex-1 py-6 px-3 space-y-1">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isReachable = step.num <= furthestStep;
                const isPast = step.num < furthestStep && !isActive;
                const StepIcon = step.icon;
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    key={step.num}
                    onClick={() => isReachable && setCurrentStep(step.num)}
                    disabled={!isReachable}
                    className={`w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : isReachable
                        ? 'text-white/60 hover:text-white hover:bg-white/5 cursor-pointer'
                        : 'text-white/25 cursor-not-allowed'
                      }`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : isReachable
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
              <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex gap-8">
                <FormProvider {...form}>
                  <div className="flex-1 min-w-0">
                    <div className="mb-6 sm:mb-8">
                      <div className="hidden md:flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                          {t("stepBadge", { step: currentStep })}
                        </span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t(`stepTitles.${currentStep}.title`)}</h1>
                      <p className="text-muted-foreground text-sm mt-1">{t(`stepTitles.${currentStep}.subtitle`)}</p>
                    </div>

                    {currentStep === 1 && (
                      <Step1Coordonnees handlePhotoUpload={handlePhotoUpload} fileInputRef={fileInputRef} />
                    )}
                    {currentStep === 2 && <Step2Experiences />}
                    {currentStep === 3 && <Step3Formation />}
                    {currentStep === 4 && <Step4Competences />}
                    {currentStep === 5 && <Step5Resume />}
                    {currentStep === 6 && <Step6Langues />}
                    {currentStep === 7 && <Step7Finaliser />}
                  </div>
                </FormProvider>

                {/* Aperçu (desktop) */}
                <div className="hidden lg:flex flex-col shrink-0 sticky top-0 self-start w-[350px]">
                  <ScaledPreview data={cvData} className="rounded-2xl border border-border shadow-sm" />
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

            <div className="border-t border-border bg-card shrink-0 pb-[env(safe-area-inset-bottom)]">
              <div className="max-w-5xl mx-auto px-3 sm:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push("/dashboard")}
                  className="flex items-center gap-1.5 px-2 sm:px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentStep > 1 ? t("footer.previous") : t("footer.dashboard")}</span>
                </Button>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Aperçu (mobile / tablette : pas de place pour l'aperçu latéral) */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="lg:hidden rounded-xl gap-1.5"
                    onClick={() => setShowMobilePreview(true)}
                    aria-label={t("previewButton")}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t("previewButton")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5"
                    onClick={() => handleSave("save")}
                    disabled={saving}
                    aria-label={t("footer.save")}
                  >
                    {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{saved ? t("footer.saved") : saving ? "..." : t("footer.save")}</span>
                  </Button>
                  {currentStep < LAST_STEP ? (
                    <Button size="sm" className="rounded-xl gap-1.5" onClick={() => goToStep(currentStep + 1)}>
                      {t("footer.next")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-1.5"
                        onClick={handleDownloadPDF}
                        disabled={exporting}
                        aria-label={t("footer.pdf")}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{exporting ? "..." : t("footer.pdf")}</span>
                      </Button>
                      <Button size="sm" className="rounded-xl gap-1.5" onClick={() => handleSave("done")} disabled={saving}>
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

      <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
        <DialogContent className="lg:hidden w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] overflow-y-auto p-4 rounded-2xl">
          <DialogTitle className="text-base font-black tracking-tight">{t("previewButton")}</DialogTitle>
          <ScaledPreview data={cvData} className="rounded-xl border border-border" />
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl"
            onClick={() => {
              setShowMobilePreview(false);
              setShowTemplateModal(true);
            }}
          >
            <Layers className="h-4 w-4" />
            {t("changeTemplate")}
          </Button>
        </DialogContent>
      </Dialog>

      {pdfNode}

      <TemplateModal showTemplateModal={showTemplateModal} setShowTemplateModal={setShowTemplateModal} cvData={cvData} setValue={setValue} />

      <AuthModal
        open={pendingSave !== null}
        onClose={() => setPendingSave(null)}
        onSuccess={() => {
          const mode = pendingSave;
          setPendingSave(null);
          setIsAuthenticated(true);
          if (mode) handleSave(mode, true);
        }}
        context="finalize"
      />
    </>
  );
};

export default CVNew;
