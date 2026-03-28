"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";

const languages = [
  { code: "fr", labelKey: "langFr" as const, flag: "🇫🇷" },
  { code: "en", labelKey: "langEn" as const, flag: "🇬🇧" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tBrand = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  function switchLocale(next: (typeof languages)[number]["code"]) {
    router.replace(pathname, { locale: next });
    setLangOpen(false);
  }

  const footerItems = [
    { labelKey: "contactUs" as const, href: "/contact" },
    { labelKey: "terms" as const, href: "/terms" },
    { labelKey: "privacy" as const, href: "/privacy" },
  ];

  return (
    <footer className="border-t border-border bg-background py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0">
        <div className="md:w-[45%] space-y-4 pr-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[hsl(235,40%,14%)] flex items-center justify-center">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold text-foreground">{tBrand("brand")}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            {t("disclaimer")}
          </p>
        </div>

        <div className="md:w-[18%] space-y-3">
          <h4 className="font-semibold text-sm text-foreground">{t("servicesTitle")}</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("createCv")}
              </Link>
            </li>
            <li>
              <span className="text-sm text-muted-foreground">{t("createCoverLetter")}</span>
            </li>
          </ul>
        </div>

        <div className="md:w-[22%] space-y-3">
          <h4 className="font-semibold text-sm text-foreground">{t("aboutTitle")}</h4>
          <ul className="space-y-2">
            {footerItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-[15%] flex md:justify-end items-start">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm text-foreground"
            >
              <span>{languages.find((l) => l.code === locale)?.flag}</span>
              <span className="font-medium">{t(languages.find((l) => l.code === locale)?.labelKey ?? "langFr")}</span>
              <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            {langOpen && (
              <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px] z-50">
                {languages.map((l) => (
                  <Button
                    key={l.code}
                    type="button"
                    variant="ghost"
                    onClick={() => switchLocale(l.code)}
                    className={`w-full justify-start px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${l.code === locale ? "text-primary font-medium" : "text-foreground"}`}
                  >
                    <span>{l.flag}</span>
                    <span>{t(l.labelKey)}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
