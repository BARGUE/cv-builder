"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import {
  PanelLeftClose, PanelLeftOpen,
  Camera, Save,
  Shield,
  Mail,
  User,
} from "lucide-react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { myToast } from "@/src/components/ui/toast";
import PasswordChangeModal from "@/src/components/account/PasswordChangeModal";
import AccountStats from "@/src/components/account/AccountStats";
import type { AccountClientProps, ProfileFormValues } from "@/src/components/account/types";
import { useTranslations } from "next-intl";
import { logoutAction } from "@/src/app/[locale]/actions/auth";
import { updateProfileAction } from "@/src/app/[locale]/actions/profile";

const defaultProfileValues: ProfileFormValues = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
};

const AccountClient = ({ user, initialCvs }: AccountClientProps) => {
  const router = useRouter();
  const t = useTranslations("account");
  const tCommon = useTranslations("common");
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
      myToast.error(t("toasts.mustBeLoggedInPhoto"));
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      myToast.error(t("toasts.fileMustBeImage"));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result && typeof result === "string") {
        setValue("avatarUrl", result, { shouldDirty: true });
        myToast.success(t("toasts.photoLoaded"));
      } else {
        myToast.error(t("toasts.cannotReadImage"));
      }
    };
    reader.onerror = () => {
      myToast.error(t("toasts.readFileError"));
    };
    reader.onabort = () => {
      myToast.error(t("toasts.readAborted"));
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toasts.unexpectedError");
      myToast.error(t("toasts.cannotLoadImage", { message: msg }));
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
      myToast.success(t("toasts.profileUpdated"));
      initialValuesRef.current = { firstName, lastName, avatarUrl };
      reset({ firstName, lastName, avatarUrl });
      router.refresh();
    } catch {
      myToast.error(t("toasts.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeRoute="account"
        user={user}
        onLogout={handleLogout}
      />

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
              <h1 className="text-3xl font-black tracking-tight">{t("pageTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{t("pageSubtitle")}</p>
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
                    {currentValues.avatarUrl ? <AvatarImage src={currentValues.avatarUrl} alt={t("avatarAlt")} /> : null}
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
                  <p className="font-bold text-foreground text-lg tracking-tight">{currentValues.firstName && currentValues.lastName ? `${currentValues.firstName} ${currentValues.lastName}` : tCommon("noName")}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  {saving && <p className="text-xs text-primary mt-2">{tCommon("uploadInProgress")}</p>}
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {t("personalInfo")}
              </h2>
              <div className="flex flex-row gap-2">
                <div className="w-1/2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    placeholder={t("firstNamePlaceholder")}
                    maxLength={100}
                    className="h-11 rounded-xl"
                    {...register("firstName")}
                  />
                </div>

                <div className="w-1/2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    placeholder={t("lastNamePlaceholder")}
                    maxLength={100}
                    className="h-11 rounded-xl"
                    {...register("lastName")}
                  />
                </div>
              </div>
              <Button type="button" size="lg" className="h-11 px-6 rounded-xl text-sm font-semibold gap-2" onClick={handleSaveProfile} disabled={disabledSaveProfile}>
                <Save className="h-4 w-4" />
                {saving ? t("saving") : t("saveProfile")}
              </Button>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                {t("security")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("securityDescription")}
              </p>
              <PasswordChangeModal onUnauthorized={handleUnauthorized} />
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-black tracking-tight mb-5">{t("statsTitle")}</h2>
            {user?.id && <AccountStats cvs={initialCvs} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountClient;
