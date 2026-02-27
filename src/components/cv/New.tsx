'use client';

import { useState, useRef, useEffect } from "react";
import { ScrollDatePicker } from "@/src/components/ui/scroll-date-picker";
import { ACCENT_COLORS } from "@/src/types/cv";
import { useCVContext } from "@/src/context/CVContext";
import CVPreview from "./Preview";
import { CVData } from "@/src/types/cv";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  FileText, ChevronLeft, ChevronRight, Save, Check, Plus, Trash2, Upload,
  User, Briefcase, GraduationCap, Zap, AlignLeft, Layers, Settings, UserCircle,
  Download,
  ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { log } from "console";

const TEMPLATES: { id: CVData['template']; label: string }[] = [
  { id: 'classic', label: 'Classique' },
  { id: 'modern', label: 'Moderne' },
  { id: 'creative', label: 'Créatif' },
  { id: 'compact', label: 'Compact' },
  { id: 'executive', label: 'Executive' },
  { id: 'sidebar', label: 'Sidebar' },
];

const steps = [
  { num: 1, label: "Coordonnées", icon: UserCircle },
  { num: 2, label: "Expérience professionnelle", icon: Briefcase },
  { num: 3, label: "Diplômes et formations", icon: GraduationCap },
  { num: 4, label: "Compétences", icon: Zap },
  { num: 5, label: "Résumé", icon: AlignLeft },
  { num: 6, label: "Autres sections", icon: Layers },
  { num: 7, label: "Finaliser", icon: Settings },
];

const CVNew = ({ initialCvData, initialCvId }: { initialCvData?: CVData | null; initialCvId?: string }) => {
  const params = useParams<{ id?: string }>();
  const id = params?.id && params.id !== "new" ? params.id : undefined;
  const router = useRouter();
  const { cvData, setCVData, saveCV, saving, downloading, downloadPDF, loadCV, cvDataLoading, cvsLoading, user } = useCVContext();

  useEffect(() => {
    const data = id === initialCvId ? initialCvData : undefined;
    loadCV(id, data);
  }, [id, initialCvId, initialCvData, loadCV]);

  // Pre-remplissage nom + email depuis le profil utilisateur (un seul effet, uniquement pour un nouveau CV)
  useEffect(() => {
    const isNewCV = id == null;
    if (!isNewCV || cvDataLoading || !user) return;

    const updates: Partial<CVData> = {};
    const first = user.profile?.firstName?.trim() ?? "";
    const last = user.profile?.lastName?.trim() ?? "";
    const fullName = [first, last].filter(Boolean).join(" ").trim();
    if (fullName && !cvData.full_name.trim()) updates.full_name = fullName;

    const email = user.email?.trim();
    if (email && !cvData.email.trim()) updates.email = email;

    if (Object.keys(updates).length > 0) {
      setCVData((prev) => ({ ...prev, ...updates }));
    }
  }, [id, cvDataLoading, user, user?.profile?.firstName, user?.profile?.lastName, user?.email, cvData.full_name, cvData.email, setCVData]);

  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cvsLoading && id && cvData?.current_step != null) {
      const step = Math.min(7, Math.max(1, cvData.current_step));
      setCurrentStep(step);
    }
  }, [cvsLoading, id, cvData?.current_step]);

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(`/cv/${id ?? "new"}`, { scroll: false });
    }, 800);
    return () => clearTimeout(t);
  }, [router, id]);

  const handleSave = async (param: 'finish' | 'kill') => {
    const dataToSave = { ...cvData, current_step: currentStep };
    if (param === 'finish') {
      dataToSave.completed = true;
      dataToSave.current_step = 7;
    }
    const savedCv = await saveCV(dataToSave, id);
    if (savedCv) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (param === 'kill' && savedCv.id) {
        router.push(`/dashboard`);
      }
    }
  };

  const update = (field: keyof CVData, value: any) => {
    setCVData({ ...cvData, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      update('photo_url', dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addExperience = () => {
    update('experiences', [...cvData.experiences, { id: crypto.randomUUID(), company: '', position: '', start_date: '', end_date: '', description: '' }]);
  };
  const removeExperience = (id: string) => update('experiences', cvData.experiences.filter(e => e.id !== id));
  const updateExperience = (id: string, field: string, value: string) => {
    update('experiences', cvData.experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEducation = () => {
    update('education', [...cvData.education, { id: crypto.randomUUID(), school: '', degree: '', start_date: '', end_date: '' }]);
  };
  const removeEducation = (id: string) => update('education', cvData.education.filter(e => e.id !== id));
  const updateEducation = (id: string, field: string, value: string) => {
    update('education', cvData.education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addSkill = () => {
    update('skills', [...cvData.skills, { id: crypto.randomUUID(), name: '', level: 3 }]);
  };
  const removeSkill = (id: string) => update('skills', cvData.skills.filter(s => s.id !== id));
  const updateSkill = (id: string, field: string, value: any) => {
    update('skills', cvData.skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addLanguage = () => {
    update('languages', [...cvData.languages, { id: crypto.randomUUID(), name: '', level: 'Intermédiaire' }]);
  };
  const removeLanguage = (id: string) => update('languages', cvData.languages.filter(l => l.id !== id));
  const updateLanguage = (id: string, field: string, value: string) => {
    update('languages', cvData.languages.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(cvData.full_name.trim() && cvData.job_title.trim() && cvData.email.trim() && cvData.phone.trim() && cvData.location.trim());
      case 2:
        return cvData.experiences.length > 0 && cvData.experiences.every(e => e.company.trim() && e.position.trim() && e.start_date.trim());
      case 3:
        return cvData.education.length > 0 && cvData.education.every(e => e.school.trim() && e.degree.trim() && e.start_date.trim());
      case 4:
        return cvData.skills.length > 0 && cvData.skills.every(s => s.name.trim());
      case 5:
        return !!(cvData.summary.trim());
      case 6:
        return cvData.languages.length === 0 || cvData.languages.every(l => l.name.trim());
      case 7:
        return !!(cvData.title.trim());
      default:
        return true;
    }
  };

  const stepValid = isStepValid(currentStep);

  if (cvsLoading || cvDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center animate-pulse">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    1: { title: "Commençons par vos coordonnées", subtitle: "Pour aider les employeurs à vous contacter, nous vous recommandons d'ajouter votre nom, votre email et votre numéro de téléphone." },
    2: { title: "Expérience professionnelle", subtitle: "Ajoutez vos expériences les plus récentes et pertinentes." },
    3: { title: "Diplômes et formations", subtitle: "Indiquez vos diplômes et formations pertinentes." },
    4: { title: "Compétences", subtitle: "Listez vos compétences clés et évaluez votre niveau." },
    5: { title: "Résumé professionnel", subtitle: "Rédigez un court résumé qui met en valeur votre profil." },
    6: { title: "Autres sections", subtitle: "Ajoutez des langues ou d'autres informations complémentaires." },
    7: { title: "Finaliser votre CV", subtitle: "Choisissez votre template et donnez un titre à votre CV." },
  };

  const progress = Math.round((currentStep / 7) * 100);

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top bar */}
        <header className="border-b border-border bg-background px-6 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-tight">CVBuilder</span>
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Step sidebar — dark navy */}
          <aside className="w-56 bg-[hsl(235,40%,14%)] flex flex-col shrink-0">
            <nav className="flex-1 py-6 px-3 space-y-1">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.num}
                    onClick={() => step.num <= currentStep ? setCurrentStep(step.num) : undefined}
                    disabled={step.num > currentStep}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${isActive
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
                    <span className="leading-tight truncate">{step.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mini progress in sidebar */}
            <div className="px-4 pb-6">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-2">Progression</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-white/70">{progress}%</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto w-full px-8 lg:px-12 py-10 flex gap-8">
                {/* Form */}
                <div className="flex-1 min-w-0">
                  {/* Step header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                        Étape {currentStep}
                      </span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">{stepTitles[currentStep].title}</h1>
                    <p className="text-muted-foreground text-sm mt-1">{stepTitles[currentStep].subtitle}</p>
                  </div>

                  {/* Step 1: Coordonnées */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-bold tracking-tight">Photo & identité</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                            {cvData.photo_url ? (
                              <img src={cvData.photo_url} alt="Photo" className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="h-3.5 w-3.5 mr-1.5" />
                              {cvData.photo_url ? 'Changer' : 'Ajouter une photo'}
                            </Button>
                            {cvData.photo_url && (
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => update('photo_url', null)}>
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Supprimer
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Nom complet *</Label>
                            <Input className="h-11 rounded-xl" value={cvData.full_name} onChange={e => update('full_name', e.target.value)} placeholder="ex. Jean Dupont" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Intitulé du poste *</Label>
                            <Input className="h-11 rounded-xl" value={cvData.job_title} onChange={e => update('job_title', e.target.value)} placeholder="ex. Développeur Web" />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-bold tracking-tight">Contact</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Téléphone *</Label>
                            <Input className="h-11 rounded-xl" value={cvData.phone} onChange={e => update('phone', e.target.value)} placeholder="ex. 06 12 34 56 78" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">E-mail *</Label>
                            <Input className="h-11 rounded-xl" value={cvData.email} onChange={e => update('email', e.target.value)} placeholder="ex. jean@exemple.com" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Ville *</Label>
                          <Input className="h-11 rounded-xl" value={cvData.location} onChange={e => update('location', e.target.value)} placeholder="ex. Paris, France" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Expériences */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      {cvData.experiences.map((exp, i) => (
                        <div key={exp.id} className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Expérience {i + 1}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => removeExperience(exp.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Entreprise *</Label>
                              <Input className="h-11 rounded-xl" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="ex. Google" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Poste *</Label>
                              <Input className="h-11 rounded-xl" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="ex. Développeur Senior" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de début *</Label>
                              <ScrollDatePicker value={exp.start_date} onChange={v => updateExperience(exp.id, 'start_date', v)} placeholder="ex. Jan 2020" className="w-full" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de fin</Label>
                              <ScrollDatePicker value={exp.end_date} onChange={v => updateExperience(exp.id, 'end_date', v)} placeholder="ex. Présent" className="w-full" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Description</Label>
                            <Textarea className="rounded-xl resize-none" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Décrivez vos responsabilités..." rows={3} />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addExperience} className="w-full h-12 rounded-xl border-dashed gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une expérience
                      </Button>
                    </div>
                  )}

                  {/* Step 3: Formation */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      {cvData.education.map((edu, i) => (
                        <div key={edu.id} className="rounded-2xl border border-border bg-card p-6 space-y-4 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Formation {i + 1}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => removeEducation(edu.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">École / Université *</Label>
                              <Input className="h-11 rounded-xl" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="ex. Université Paris-Saclay" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Diplôme *</Label>
                              <Input className="h-11 rounded-xl" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="ex. Master Informatique" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de début *</Label>
                              <ScrollDatePicker value={edu.start_date} onChange={v => updateEducation(edu.id, 'start_date', v)} placeholder="ex. Sep 2018" className="w-full" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de fin</Label>
                              <ScrollDatePicker value={edu.end_date} onChange={v => updateEducation(edu.id, 'end_date', v)} placeholder="ex. Jun 2020" className="w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addEducation} className="w-full h-12 rounded-xl border-dashed gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une formation
                      </Button>
                    </div>
                  )}

                  {/* Step 4: Compétences */}
                  {currentStep === 4 && (
                    <div className="space-y-3">
                      {cvData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                          <Input className="flex-1 h-11 rounded-xl" placeholder="ex. JavaScript" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} />
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(l => (
                              <button
                                key={l}
                                type="button"
                                onClick={() => updateSkill(skill.id, 'level', l)}
                                className={`h-9 w-9 rounded-lg text-xs font-bold transition-colors ${l <= skill.level ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                  }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => removeSkill(skill.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addSkill} className="w-full h-12 rounded-xl border-dashed gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une compétence
                      </Button>
                    </div>
                  )}

                  {/* Step 5: Résumé */}
                  {currentStep === 5 && (
                    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Résumé professionnel *</Label>
                        <Textarea
                          className="rounded-xl resize-none"
                          value={cvData.summary}
                          onChange={e => update('summary', e.target.value)}
                          placeholder="Décrivez-vous en quelques phrases. Mettez en avant vos points forts et votre valeur ajoutée..."
                          rows={8}
                        />
                        <p className="text-xs text-muted-foreground">{cvData.summary.length} caractères</p>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Langues */}
                  {currentStep === 6 && (
                    <div className="space-y-3">
                      {cvData.languages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                          <Input className="flex-1 h-11 rounded-xl" placeholder="ex. Anglais" value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} />
                          <select
                            value={lang.level}
                            onChange={e => updateLanguage(lang.id, 'level', e.target.value)}
                            className="h-11 rounded-xl border border-input bg-background px-3 text-sm"
                          >
                            <option>Débutant</option>
                            <option>Intermédiaire</option>
                            <option>Avancé</option>
                            <option>Courant</option>
                            <option>Natif</option>
                          </select>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => removeLanguage(lang.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addLanguage} className="w-full h-12 rounded-xl border-dashed gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter une langue
                      </Button>
                    </div>
                  )}

                 {/* Step 7: Finaliser */}
                 {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        <span className="text-sm font-bold tracking-tight">Titre du CV</span>
                        <Input className="h-11 rounded-xl" value={cvData.title} onChange={e => update('title', e.target.value)} placeholder="ex. Mon CV Développeur" />
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        <span className="text-sm font-bold tracking-tight">Template</span>
                        <div className="grid grid-cols-3 gap-3">
                          {TEMPLATES.map(t => (
                            <button
                              key={t.id}
                              onClick={() => update('template', t.id)}
                              className={`rounded-xl border-2 p-4 text-center text-sm font-semibold transition-all ${
                                cvData.template === t.id
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview mini */}
                <div className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 self-start">
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden" style={{ width: '288px', height: '407px' }}>
                    <div style={{ transform: 'scale(0.484)', transformOrigin: 'top left', width: '595px', height: '842px', pointerEvents: 'none' }}>
                      <CVPreview data={cvData} />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full gap-2 rounded-xl"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <Layers className="h-4 w-4" />
                    Changer de modèle
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border bg-card shrink-0">
              <div className="max-w-5xl mx-auto px-8 lg:px-12 py-3.5 flex items-center justify-between">
                <button
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push("/dashboard")}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {currentStep > 1 ? 'Précédent' : 'Dashboard'}
                </button>
                <div className="flex items-center gap-3">
                  {!stepValid && currentStep < 7 && (
                    <p className="text-xs text-destructive font-medium">Champs obligatoires manquants</p>
                  )}
                  <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => handleSave('finish')} disabled={saving}>
                    {saved ? <><Check className="h-3.5 w-3.5" /> Sauvegardé</> : saving ? "..." : <><Save className="h-3.5 w-3.5" /> Sauvegarder</>}
                  </Button>
                  {currentStep < 7 ? (
                    <Button
                      size="sm"
                      className="rounded-xl gap-1.5 disabled:opacity-40"
                      onClick={() => stepValid && setCurrentStep(currentStep + 1)}
                      disabled={!stepValid}
                    >
                      Suivant
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="rounded-xl gap-1.5"
                        onClick={() => downloadPDF(pdfRef.current)}
                        disabled={downloading}>
                        <Download className="h-3.5 w-3.5" />
                        {downloading ? "..." : "PDF"}
                      </Button>
                      <Button size="sm" className="rounded-xl gap-1.5" onClick={() => handleSave('kill')}>
                        Terminer
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

      {/* Template Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">Changer de modèle</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-3 gap-4 py-2 pr-1">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { update('template', t.id); setShowTemplateModal(false); }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all ${
                    cvData.template === t.id
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
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm font-bold mb-3">Couleur d'accent</p>
            <div className="flex items-center gap-2 flex-wrap">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => update('accent_color', c.value)}
                  className="h-8 w-8 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    borderColor: cvData.accent_color === c.value ? 'white' : c.value,
                    outline: cvData.accent_color === c.value ? `3px solid ${c.value}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              <div className="relative h-8 w-8">
                <input type="color" value={cvData.accent_color} onChange={e => update('accent_color', e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground text-xs font-bold hover:border-foreground transition-colors"
                  style={{ backgroundColor: ACCENT_COLORS.some(c => c.value === cvData.accent_color) ? 'transparent' : cvData.accent_color }}>
                  {ACCENT_COLORS.some(c => c.value === cvData.accent_color) ? '+' : ''}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '595px' }}>
        <div ref={pdfRef} style={{ width: '595px', fontFamily: 'Inter, sans-serif' }}>
          <CVPreview data={cvData} forPdf />
        </div>
      </div>
    </>
  );
};

export default CVNew;
