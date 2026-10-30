"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-black tracking-tight mb-2">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t("description")}</p>
        <Button className="rounded-xl px-8" onClick={reset}>
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
