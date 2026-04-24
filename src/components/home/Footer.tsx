"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { LocaleSwitcher } from "@/src/components/ui/LocaleSwitcher";

export function Footer() {
  const t = useTranslations("footer");
  const tBrand = useTranslations();

  const footerItems = [
    { labelKey: "contactUs" as const, href: "/contact" },
    { labelKey: "terms" as const, href: "/legal/terms" },
    { labelKey: "privacy" as const, href: "/legal/privacy" },
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
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}
