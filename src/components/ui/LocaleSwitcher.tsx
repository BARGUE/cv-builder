"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import englishFlag from "@/public/assets/flag/en.png";
import frenchFlag from "@/public/assets/flag/fr.png";

const languages = [
  { code: "fr", labelKey: "langFr" as const, flag: frenchFlag },
  { code: "en", labelKey: "langEn" as const, flag: englishFlag },
];

interface LocaleSwitcherProps {
  dropdownAlign?: "left" | "right";
  dropdownDirection?: "up" | "down";
  showText?: boolean;
  withBackground?: boolean;
  className?: string;
}

export function LocaleSwitcher({
  dropdownAlign = "right",
  dropdownDirection = "down",
  showText = true,
  withBackground = true,
  className,
}: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(next: (typeof languages)[number]["code"]) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  const current = languages.find((l) => l.code === locale);

  const triggerClass = withBackground
    ? `flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm text-foreground ${className ?? ""}`
    : `flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/50 hover:text-white ${className ?? ""}`;

  const dropdownPositionClass =
    dropdownDirection === "up" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div className="relative">
      <Button
        type="button"
        variant={withBackground ? "outline" : "ghost"}
        onClick={() => setOpen(!open)}
        className={triggerClass}
      >
        {current && (
          <Image src={current.flag} alt={locale} style={{ width: 20, height: 20 }} />
        )}
        {showText && (
          <span className="font-medium">{t(current?.labelKey ?? "langFr")}</span>
        )}
        <svg
          className="h-3 w-3 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      {open && (
        <div
          className={`absolute ${dropdownPositionClass} ${dropdownAlign === "right" ? "right-0" : "left-0"} bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50`}
        >
          {languages.map((l) => (
            <Button
              key={l.code}
              type="button"
              variant="ghost"
              onClick={() => switchLocale(l.code)}
              className={`w-full justify-start px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${l.code === locale ? "text-primary font-medium" : "text-foreground"}`}
            >
              <Image src={l.flag} alt={l.code} style={{ width: 20, height: 20 }} />
              <span>{t(l.labelKey)}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
