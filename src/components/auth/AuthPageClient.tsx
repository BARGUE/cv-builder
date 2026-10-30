"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { myToast } from "@/src/components/ui/toast";
import { AuthForm, type AuthMode } from "@/src/components/auth/AuthForm";

export function AuthPageClient({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const t = useTranslations("auth");
  const errorFromUrl = useSearchParams().get("error");
  const isLogin = mode === "login";

  useEffect(() => {
    if (errorFromUrl) myToast.error(errorFromUrl);
  }, [errorFromUrl]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>

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

        <AuthForm
          mode={mode}
          onSuccess={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        />

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? t("toggleLoginPrompt") : t("toggleRegisterPrompt")}
          <Link href={isLogin ? "/auth/register" : "/auth/login"} className="text-primary font-medium hover:underline">
            {isLogin ? t("toggleToRegister") : t("toggleToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
