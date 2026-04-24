"use client";

import { useState, FormEvent, useCallback } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { myToast } from "@/src/components/ui/toast";
import { loginAction, registerAction } from "@/src/app/[locale]/actions/auth";
import { useTranslations } from "next-intl";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  context?: "finalize" | "import";
}

const MIN_PASSWORD_LENGTH = 6;

export function AuthModal({ open, onClose, onSuccess, context = "finalize" }: AuthModalProps) {
  const t = useTranslations("auth");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

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
      onSuccess();
    } catch (err) {
      showError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  const titleLine1 = isLogin
    ? t("loginTitle")
    : context === "import"
    ? t("modal.titleImport")
    : t("modal.titleFinalize");

  const titleHighlight = isLogin
    ? null
    : context === "import"
    ? t("modal.titleImportHighlight")
    : t("modal.titleFinalizeHighlight");

  const subtitle = isLogin
    ? t("loginSubtitle")
    : context === "import"
    ? t("modal.subtitleImport")
    : t("modal.subtitleFinalize");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center px-4 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200">
          <DialogPrimitive.Title className="sr-only">
            {titleLine1}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {subtitle}
          </DialogPrimitive.Description>

          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                {titleLine1}
                {titleHighlight && (
                  <>
                    <br />
                    <span className="text-primary">{titleHighlight}</span>
                  </>
                )}
              </h1>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modal-firstName" className="text-sm font-medium text-foreground">
                      {t("firstName")}
                    </Label>
                    <Input id="modal-firstName" name="firstName" type="text" required className="h-11 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modal-lastName" className="text-sm font-medium text-foreground">
                      {t("lastName")}
                    </Label>
                    <Input id="modal-lastName" name="lastName" type="text" required className="h-11 border-border" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="modal-email" className="text-sm font-medium text-foreground">
                  {t("email")}
                </Label>
                <Input id="modal-email" name="email" type="email" required className="h-11 border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-password" className="text-sm font-medium text-foreground">
                  {t("password")}
                </Label>
                <Input
                  id="modal-password"
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

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? t("toggleLoginPrompt") : t("toggleRegisterPrompt")}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? t("toggleToRegister") : t("toggleToLogin")}
              </button>
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
