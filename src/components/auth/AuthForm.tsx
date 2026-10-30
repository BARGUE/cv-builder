"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { myToast } from "@/src/components/ui/toast";
import { loginAction, registerAction } from "@/src/app/[locale]/actions/auth";
import { MIN_PASSWORD_LENGTH } from "@/src/lib/validations/cv";

export type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onSuccess: () => void;
  /** Préfixe des ids de champs, pour éviter les doublons si plusieurs formulaires coexistent. */
  idPrefix?: string;
}

export function AuthForm({ mode, onSuccess, idPrefix = "" }: AuthFormProps) {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";
  const id = (name: string) => `${idPrefix}${name}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();

    if (!email || !password) return myToast.error(t("errors.emailPasswordRequired"));
    if (password.length < MIN_PASSWORD_LENGTH) return myToast.error(t("errors.passwordMin", { min: MIN_PASSWORD_LENGTH }));
    if (!isLogin && (!firstName || !lastName)) return myToast.error(t("errors.nameRequired"));

    setLoading(true);
    try {
      const result = isLogin
        ? await loginAction({ email, password })
        : await registerAction({ email, password, firstName, lastName });
      if (!result.success) {
        myToast.error(result.error);
        return;
      }
      myToast.success(isLogin ? t("toast.loginOk") : t("toast.registerOk"));
      onSuccess();
    } catch {
      myToast.error(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={id("firstName")} className="text-sm font-medium text-foreground">{t("firstName")}</Label>
            <Input id={id("firstName")} name="firstName" type="text" autoComplete="given-name" required className="h-11 border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={id("lastName")} className="text-sm font-medium text-foreground">{t("lastName")}</Label>
            <Input id={id("lastName")} name="lastName" type="text" autoComplete="family-name" required className="h-11 border-border" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={id("email")} className="text-sm font-medium text-foreground">{t("email")}</Label>
        <Input id={id("email")} name="email" type="email" autoComplete="email" required className="h-11 border-border" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={id("password")} className="text-sm font-medium text-foreground">{t("password")}</Label>
        <Input
          id={id("password")}
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder={t("passwordPlaceholder")}
          required
          minLength={MIN_PASSWORD_LENGTH}
          className="h-11 border-border"
        />
      </div>

      <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold" disabled={loading}>
        {loading ? t("submitLoading") : isLogin ? t("submitLogin") : t("submitRegister")}
      </Button>
    </form>
  );
}
