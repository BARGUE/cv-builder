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
  Download
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

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
  const { cvData, setCVData, saveCV, saving, downloading, downloadPDF, loadCV, cvDataLoading, cvsLoading } = useCVContext();

  useEffect(() => {
    const data = id === initialCvId ? initialCvData : undefined;
    loadCV(id, data);
  }, [id, initialCvId, initialCvData, loadCV]);

  const [currentStep, setCurrentStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [serverDownloading, setServerDownloading] = useState(false);
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

  return (
    <>
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <header className="border-b border-border bg-card px-6 h-12 flex items-center justify-between shrink-0">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">CVBuilder</span>
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-52 bg-primary flex flex-col shrink-0">
            <nav className="flex-1 py-6 px-3 space-y-1">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                return (
                  <button
                    key={step.num}
                    onClick={() => step.num <= currentStep ? setCurrentStep(step.num) : undefined}
                    disabled={step.num > currentStep}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${isActive
                      ? 'bg-primary-foreground/15 text-primary-foreground font-medium'
                      : step.num < currentStep
                        ? 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 cursor-pointer'
                        : 'text-primary-foreground/30 cursor-not-allowed'
                      }`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isActive
                      ? 'bg-primary-foreground text-primary'
                      : isPast
                        ? 'bg-primary-foreground/30 text-primary-foreground'
                        : 'bg-primary-foreground/10 text-primary-foreground/50'
                      }`}>
                      {isPast ? <Check className="h-3.5 w-3.5" /> : step.num}
                    </div>
                    <span className="leading-tight">{step.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto w-full px-8 py-10 flex gap-8">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold mb-2">{stepTitles[currentStep].title}</h1>
                  <p className="text-muted-foreground text-sm mb-8">{stepTitles[currentStep].subtitle}</p>

                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Nom complet</Label>
                          <Input value={cvData.full_name} onChange={e => update('full_name', e.target.value)} placeholder="ex. Jean Dupont" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Intitulé du poste</Label>
                          <Input value={cvData.job_title} onChange={e => update('job_title', e.target.value)} placeholder="ex. Développeur Web" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Photo (facultatif)</Label>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                            {cvData.photo_url ? (
                              <Image src={cvData.photo_url} alt="Photo" className="h-full w-full object-cover" width={56} height={56} />
                            ) : (
                              <User className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="h-3.5 w-3.5 mr-1.5" />
                              {cvData.photo_url ? 'Changer la photo' : 'Ajouter une photo'}
                            </Button>
                            {cvData.photo_url && (
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => update('photo_url', null)}>
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Supprimer la photo
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">Numéro de téléphone</Label>
                          <Input value={cvData.phone} onChange={e => update('phone', e.target.value)} placeholder="ex. (020) 1234 5678" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium">E-mail</Label>
                          <Input value={cvData.email} onChange={e => update('email', e.target.value)} placeholder="ex. jean@exemple.com" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Ville</Label>
                        <Input value={cvData.location} onChange={e => update('location', e.target.value)} placeholder="ex. Paris" />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id} className="rounded-xl border border-border bg-card p-5 space-y-3 relative">
                          <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeExperience(exp.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Entreprise</Label>
                              <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="ex. Google" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Poste</Label>
                              <Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="ex. Développeur Senior" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de début</Label>
                              <ScrollDatePicker value={exp.start_date} onChange={v => updateExperience(exp.id, 'start_date', v)} placeholder="ex. Jan 2020" className="w-full" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de fin</Label>
                              <ScrollDatePicker value={exp.end_date} onChange={v => updateExperience(exp.id, 'end_date', v)} placeholder="ex. Présent" className="w-full" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium">Description</Label>
                            <Textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Décrivez vos responsabilités..." rows={3} className="resize-none" />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addExperience} className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une expérience
                      </Button>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="rounded-xl border border-border bg-card p-5 space-y-3 relative">
                          <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">École / Université</Label>
                              <Input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} placeholder="ex. Université Paris-Saclay" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Diplôme</Label>
                              <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="ex. Master Informatique" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de début</Label>
                              <ScrollDatePicker value={edu.start_date} onChange={v => updateEducation(edu.id, 'start_date', v)} placeholder="ex. Sep 2018" className="w-full" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-sm font-medium">Date de fin</Label>
                              <ScrollDatePicker value={edu.end_date} onChange={v => updateEducation(edu.id, 'end_date', v)} placeholder="ex. Jun 2020" className="w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addEducation} className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une formation
                      </Button>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-3">
                      {cvData.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                          <Input className="flex-1" placeholder="ex. JavaScript" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} />
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(l => (
                              <button
                                key={l}
                                type="button"
                                onClick={() => updateSkill(skill.id, 'level', l)}
                                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${l <= skill.level ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                  }`}
                              >
                                {l}
                              </button>
                            ))}
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeSkill(skill.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addSkill} className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une compétence
                      </Button>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Résumé professionnel</Label>
                        <Textarea
                          value={cvData.summary}
                          onChange={e => update('summary', e.target.value)}
                          placeholder="Décrivez-vous en quelques phrases. Mettez en avant vos points forts et votre valeur ajoutée..."
                          rows={6}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 6 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">Langues</h3>
                      {cvData.languages.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                          <Input className="w-48" placeholder="ex. Anglais" value={lang.name} onChange={e => updateLanguage(lang.id, 'name', e.target.value)} />
                          <select
                            value={lang.level}
                            onChange={e => updateLanguage(lang.id, 'level', e.target.value)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm w-auto"
                          >
                            <option>Débutant</option>
                            <option>Intermédiaire</option>
                            <option>Avancé</option>
                            <option>Courant</option>
                            <option>Natif</option>
                          </select>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeLanguage(lang.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addLanguage} className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une langue
                      </Button>
                    </div>
                  )}

                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Titre du CV</Label>
                        <Input value={cvData.title} onChange={e => update('title', e.target.value)} placeholder="ex. Mon CV Développeur" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Template</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['classic', 'modern', 'creative'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => update('template', t)}
                              className={`rounded-xl border-2 p-4 text-center text-sm font-medium capitalize transition-all ${cvData.template === t
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/30'
                                }`}
                            >
                              {t === 'classic' ? 'Classique' : t === 'modern' ? 'Moderne' : 'Créatif'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 self-start">
                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden" style={{ width: '288px', height: '407px' }}>
                    <div style={{ transform: 'scale(0.484)', transformOrigin: 'top left', width: '595px', height: '842px', pointerEvents: 'none' }}>
                      <CVPreview data={cvData} />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 w-full gap-2"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <Layers className="h-4 w-4" />
                    Changer de modèle
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-card shrink-0">
              <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between">
                <button
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push("/dashboard")}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </button>
                <div className="flex items-center gap-3">
                  {!stepValid && currentStep < 7 && (
                    <p className="text-xs text-destructive">Veuillez remplir tous les champs obligatoires</p>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleSave('kill')} disabled={saving}>
                    {saved ? <><Check className="h-4 w-4 mr-1" /> Sauvegardé</> : saving ? "Sauvegarde..." : <><Save className="h-4 w-4 mr-1" /> Sauvegarder</>}
                  </Button>
                  {currentStep < 7 ? (
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => stepValid && setCurrentStep(currentStep + 1)}
                      disabled={!stepValid}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPDF(pdfRef.current)}
                        disabled={downloading || serverDownloading}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {downloading || serverDownloading ? "Génération..." : "Télécharger PDF"}
                      </Button>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleSave('finish')}>
                        Terminer
                        <Check className="h-4 w-4 ml-1" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Changer de modèle</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-3 gap-4 py-2 pr-1">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { update('template', t.id); setShowTemplateModal(false); }}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-all ${cvData.template === t.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/40'
                    }`}
                >
                  <div className="rounded-lg overflow-hidden bg-muted w-full" style={{ height: '200px' }}>
                    <div style={{ transform: 'scale(0.265)', transformOrigin: 'top left', width: '595px', height: '755px', pointerEvents: 'none' }}>
                      <CVPreview data={{ ...cvData, template: t.id }} />
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${cvData.template === t.id ? 'text-primary' : 'text-foreground'}`}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold mb-3">Couleur d'accent</p>
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
                <input
                  type="color"
                  value={cvData.accent_color}
                  onChange={e => update('accent_color', e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div
                  className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground text-xs font-bold hover:border-foreground transition-colors"
                  style={{ backgroundColor: ACCENT_COLORS.some(c => c.value === cvData.accent_color) ? 'transparent' : cvData.accent_color }}
                >
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
