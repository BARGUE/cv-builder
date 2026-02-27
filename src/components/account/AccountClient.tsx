"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import {
  FileText, LogOut, User, PanelLeftClose, PanelLeftOpen,
  Camera, Save, Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import PasswordChangeModal from "@/src/components/account/PasswordChangeModal";
import AccountStats from "@/src/components/account/AccountStats";
import { useCVContext } from "@/src/context/CVContext";

const AccountClient = () => {
  const router = useRouter();
  const { handleUnauthorized, user } = useCVContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.profile) {
      setFullName(user.profile.fullName ?? "");
      setAvatarUrl(user.profile.avatarUrl ?? null);
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté pour modifier votre photo.");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image (JPEG, PNG, GIF, etc.).");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result && typeof result === "string") {
        setAvatarUrl(result);
        toast.success("Photo chargée. Cliquez sur « Enregistrer » pour l'appliquer.");
      } else {
        toast.error("Impossible de lire l'image.");
      }
    };
    reader.onerror = () => {
      toast.error("Erreur lors de la lecture du fichier. Réessayez avec une autre image.");
    };
    reader.onabort = () => {
      toast.error("Lecture du fichier annulée.");
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue";
      toast.error(`Impossible de charger l'image : ${msg}`);
    }
    e.target.value = "";
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const body: { fullName?: string; avatarUrl?: string } = { fullName: fullName || undefined };
      if (avatarUrl) body.avatarUrl = avatarUrl;
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error((data as { error?: string }).error ?? "Erreur lors de la sauvegarde.");
        return;
      }
      toast.success("Profil mis à jour !");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName
    ? fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`${sidebarOpen ? 'w-48' : 'w-14'} bg-primary flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300`}>
        <div className={`px-3 py-5 ${sidebarOpen ? 'px-4' : 'px-3'}`}>
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-foreground">
            <div className="h-7 w-7 rounded bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            {sidebarOpen && <span className="font-semibold text-sm">CVBuilder</span>}
          </Link>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            {sidebarOpen && "Documents"}
          </Link>
        </nav>
        <div className="px-2 pb-4 space-y-1">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors w-full ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && "Déconnexion"}
          </button>
          <Link
            href="/account"
            className={`flex items-center gap-2 px-3 py-2 mt-1 rounded-lg bg-primary-foreground/15 transition-colors ${!sidebarOpen ? 'justify-center px-0' : ''}`}
          >
            <div className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-primary-foreground/70" />
            </div>
            {sidebarOpen && <span className="text-xs text-primary-foreground/60 truncate">{user?.email}</span>}
          </Link>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-14'}`}>
        <header className="border-b border-border bg-card px-8 py-5 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <div className="h-5 w-px bg-border" />
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-xl font-bold">Mon compte</h1>
        </header>

        <div className="w-full max-w-5xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          <div className="space-y-8">
            <section className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-2 border-border">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar" /> : null}
                  <AvatarFallback className="text-lg font-semibold bg-muted text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Camera className="h-5 w-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{fullName || "Sans nom"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {saving && <p className="text-xs text-muted-foreground mt-1">Upload en cours...</p>}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Informations</h2>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  maxLength={100}
                />
              </div>
              <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-sm font-semibold text-foreground">Sécurité</h2>
              <PasswordChangeModal />
            </section>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">Statistiques du compte</h2>
            {user && user.id && <AccountStats userId={user.id} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountClient;
