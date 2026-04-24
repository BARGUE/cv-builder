"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { myToast } from "@/src/components/ui/toast";
import { loginAction, registerAction } from "@/src/app/[locale]/actions/auth";

const MIN_PASSWORD_LENGTH = 6;

const VALID_MODES = ["login", "register"] as const;

export default function AuthPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const name = (params?.name as string) ?? "";
  const isLogin = name === "login";
  const errorFromUrl = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (VALID_MODES.includes(name as "login" | "register")) return;
    router.replace("/auth/login");
  }, [name, router]);

  useEffect(() => {
    if (!errorFromUrl) return;
    const message = (() => {
      try {
        return decodeURIComponent(errorFromUrl);
      } catch {
        return errorFromUrl;
      }
    })();
    myToast.error(message);
  }, [errorFromUrl]);

  const showError = useCallback((message: string) => {
    myToast.error(message);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.email as HTMLInputElement).value.trim();
    const password = (form.password as HTMLInputElement).value;

    if (!email || !password) {
      showError(t("errors.emailPasswordRequired"));
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      showError(t("errors.passwordMin", { min: MIN_PASSWORD_LENGTH }));
      return;
    }

    let firstName = "";
    let lastName = "";
    if (!isLogin) {
      firstName = (form.firstName as HTMLInputElement).value.trim();
      lastName = (form.lastName as HTMLInputElement).value.trim();
      if (!firstName || !lastName) {
        showError(t("errors.nameRequired"));
        return;
      }
    }

    setLoading(true);
    try {
      const result = isLogin
        ? await loginAction({ email, password })
        : await registerAction({ email, password, firstName, lastName });
      if (!result.success) {
        showError(result.error);
        return;
      }
      myToast.success(isLogin ? t("toast.loginOk") : t("toast.registerOk"));
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errors.generic");
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!VALID_MODES.includes(name as "login" | "register")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            {isLogin ? (
              t("loginTitle")
            ) : (
              <>
                {t("registerTitleLine1")}<br />
                <span className="text-primary">{t("registerTitleHighlight")}</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-sm">
            {isLogin ? t("loginSubtitle") : t("registerSubtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="h-11 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="h-11 border-border"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="h-11 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              required
              minLength={MIN_PASSWORD_LENGTH}
              className="h-11 border-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold"
            disabled={loading}
          >
            {loading ? t("submitLoading") : isLogin ? t("submitLogin") : t("submitRegister")}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? t("toggleLoginPrompt") : t("toggleRegisterPrompt")}
          <Link
            href={isLogin ? "/auth/register" : "/auth/login"}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? t("toggleToRegister") : t("toggleToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
