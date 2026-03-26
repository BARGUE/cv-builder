"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import {
  FileText, LogOut, User, PanelLeftClose, PanelLeftOpen,
  Camera, Save, Settings,
  Shield,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { myToast } from "@/src/components/ui/toast";
import Link from "next/link";
import PasswordChangeModal from "@/src/components/account/PasswordChangeModal";
import AccountStats from "@/src/components/account/AccountStats";
import type { AccountClientProps, ProfileFormValues } from "@/src/components/account/types";
import { logoutAction } from "@/src/app/actions/auth";
import { updateProfileAction } from "@/src/app/actions/profile";

const defaultProfileValues: ProfileFormValues = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
};

const AccountClient = ({ user, initialCvs }: AccountClientProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const initialValuesRef = useRef<ProfileFormValues>(defaultProfileValues);

  const form = useForm<ProfileFormValues>({
    defaultValues: defaultProfileValues,
  });
  const { register, watch, setValue, reset } = form;
  const currentValues = watch();

  useEffect(() => {
    if (!user?.profile) return;
    const initial: ProfileFormValues = {
      firstName: user.profile.firstName ?? "",
      lastName: user.profile.lastName ?? "",
      avatarUrl: user.profile.avatarUrl ?? "",
    };
    initialValuesRef.current = initial;
    reset(initial);
  }, [user, reset]);

  const hasChanges =
    currentValues.firstName !== initialValuesRef.current.firstName ||
    currentValues.lastName !== initialValuesRef.current.lastName ||
    currentValues.avatarUrl !== initialValuesRef.current.avatarUrl;

  const initials =
    currentValues.firstName && currentValues.lastName
      ? currentValues.firstName.charAt(0).toUpperCase() + currentValues.lastName.charAt(0).toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "?";

  const disabledSaveProfile = saving || !hasChanges;

  const handleUnauthorized = () => {
    router.push("/");
    router.refresh();
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!user) {
      myToast.error("Vous devez être connecté pour modifier votre photo.");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      myToast.error("Le fichier doit être une image (JPEG, PNG, GIF, etc.).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result && typeof result === "string") {
        setValue("avatarUrl", result, { shouldDirty: true });
        myToast.success("Photo chargée. Cliquez sur « Enregistrer » pour l'appliquer.");
      } else {
        myToast.error("Impossible de lire l'image.");
      }
    };
    reader.onerror = () => {
      myToast.error("Erreur lors de la lecture du fichier. Réessayez avec une autre image.");
    };
    reader.onabort = () => {
      myToast.error("Lecture du fichier annulée.");
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue";
      myToast.error(`Impossible de charger l'image : ${msg}`);
    }
    e.target.value = "";
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const { firstName, lastName, avatarUrl } = form.getValues();
    setSaving(true);
    try {
      const result = await updateProfileAction({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      if (!result.success) {
        if (result.error === "Non authentifié") {
          handleUnauthorized();
          return;
        }
        myToast.error(result.error);
        return;
      }
      myToast.success("Profil mis à jour !");
      initialValuesRef.current = { firstName, lastName, avatarUrl };
      reset({ firstName, lastName, avatarUrl });
      router.refresh();
    } catch {
      myToast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — same as Dashboard */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-16"} bg-[hsl(235,40%,14%)] flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300`}
      >
        <div className={`px-4 py-6 ${!sidebarOpen && "px-3"}`}>
          <Link href="/dashboard" className="flex items-center gap-2.5 text-white">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            {sidebarOpen && (
              <span className="font-black text-sm tracking-tight">CVBuilder</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            {sidebarOpen && "Documents"}
          </Link>
          <Link
            href="/account"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {sidebarOpen && "Mon compte"}
          </Link>
        </nav>

        <div className="px-3 pb-5 space-y-1.5">
          <Button
            variant="ghost"
            onClick={() => handleLogout()}
            className={`flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-xl bg-transparent cursor-pointer text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full ${!sidebarOpen ? "justify-center px-0" : ""}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && "Déconnexion"}
          </Button>
          <Link
            href="/account"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors ${!sidebarOpen ? "justify-center px-0" : ""}`}
          >
            <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-white/60" />
            </div>
            {sidebarOpen && (
              <span className="text-xs text-white/40 truncate">
                {user?.email ?? ""}
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-background px-8 lg:px-12 pt-10 pb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Mon compte</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Gérez votre profil et vos préférences</p>
            </div>
          </div>
        </header>

        <div className="border-b border-border" />

        {/* Content */}
        <div className="px-8 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl">
          {/* Left: Profile info */}
          <div className="lg:col-span-3 space-y-8">
            {/* Avatar card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    {currentValues.avatarUrl ? <AvatarImage src={currentValues.avatarUrl} alt="Avatar" /> : null}
                    <AvatarFallback className="text-lg font-black bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    className="absolute inset-0 h-full w-full rounded-full bg-foreground/0 group-hover:bg-foreground/40 flex items-center justify-center transition-colors cursor-pointer [&_svg]:size-5"
                  >
                    <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-lg tracking-tight">{currentValues.firstName && currentValues.lastName ? `${currentValues.firstName} ${currentValues.lastName}` : "Sans nom"}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  {saving && <p className="text-xs text-primary mt-2">Upload en cours...</p>}
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Informations personnelles
              </h2>
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    maxLength={100}
                    className="h-11 rounded-xl"
                    {...register("firstName")}
                  />
                </div>

                <div className="w-1/2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    maxLength={100}
                    className="h-11 rounded-xl"
                    {...register("lastName")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adresse e-mail</Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-11 rounded-xl bg-muted/50"
                />
              </div>
              <Button type="button" size="lg" className="h-11 px-6 rounded-xl text-sm font-semibold gap-2" onClick={handleSaveProfile} disabled={disabledSaveProfile}>
                <Save className="h-4 w-4" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Sécurité
              </h2>
              <p className="text-sm text-muted-foreground">
                Mettez à jour votre mot de passe pour sécuriser votre compte.
              </p>
              <PasswordChangeModal onUnauthorized={handleUnauthorized} />
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-black tracking-tight mb-5">Statistiques</h2>
            {user?.id && <AccountStats cvs={initialCvs} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountClient;
