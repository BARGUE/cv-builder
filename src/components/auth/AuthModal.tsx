"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthForm } from "@/src/components/auth/AuthForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  context?: "finalize" | "import";
}

export function AuthModal({ open, onClose, onSuccess, context = "finalize" }: AuthModalProps) {
  const t = useTranslations("auth");
  const [isLogin, setIsLogin] = useState(false);

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
          <DialogPrimitive.Title className="sr-only">{titleLine1}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{subtitle}</DialogPrimitive.Description>

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

            <AuthForm mode={isLogin ? "login" : "register"} onSuccess={onSuccess} idPrefix="modal-" />

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
