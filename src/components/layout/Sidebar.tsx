"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileText, LogOut, User, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/src/components/ui/LocaleSwitcher";
import { cn } from "@/src/lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  activeRoute: "dashboard" | "account";
  user?: { email?: string | null };
  onLogout: () => void;
}

/** Marge à appliquer au contenu principal pour ne pas passer sous la barre latérale. */
export const sidebarOffsetClass = (sidebarOpen: boolean) => (sidebarOpen ? "ml-16 md:ml-56" : "ml-16");

/**
 * Sous `md`, la barre est toujours repliée en rail d'icônes (64 px) ;
 * au-delà, elle suit `sidebarOpen`.
 */
export function Sidebar({ sidebarOpen, activeRoute, user, onLogout }: SidebarProps) {
  const t = useTranslations("sidebar");
  // Visible uniquement quand la barre est dépliée (donc jamais sur mobile).
  const expandedOnly = sidebarOpen ? "hidden md:inline" : "hidden";
  // Centrage des icônes quand la barre est repliée.
  const collapsed = sidebarOpen ? "max-md:justify-center max-md:px-0" : "justify-center px-0";

  const navItems = [
    {
      href: "/dashboard",
      icon: FileText,
      label: t("documents"),
      active: activeRoute === "dashboard",
    },
    ...(activeRoute === "account"
      ? [{ href: "/account", icon: Settings, label: t("account"), active: true }]
      : []),
  ];

  return (
    <aside
      className={cn(
        "w-16 bg-[hsl(235,40%,14%)] flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300",
        sidebarOpen && "md:w-56"
      )}
    >
      <div className={cn("px-3 py-6", sidebarOpen && "md:px-4")}>
        <Link href="/dashboard" className={cn("flex items-center gap-2.5 text-white", collapsed)}>
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <span className={cn("font-black text-sm tracking-tight", expandedOnly)}>CVBuilder</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors",
                item.active
                  ? "font-semibold bg-white/10 text-white"
                  : "font-medium text-white/50 hover:text-white hover:bg-white/5",
                collapsed
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={expandedOnly}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 space-y-1.5">
        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          aria-label={t("logout")}
          className={cn(
            "flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full",
            collapsed
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={expandedOnly}>{t("logout")}</span>
        </Button>
        <div className={cn("flex items-center", sidebarOpen ? "max-md:justify-center md:gap-1" : "justify-center")}>
          <Link
            href="/account"
            aria-label={t("account")}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors min-w-0 flex-1",
              collapsed
            )}
          >
            <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-white/60" />
            </div>
            <span className={cn("text-xs text-white/40 truncate", expandedOnly)}>
              {user?.email ?? ""}
            </span>
          </Link>
          {sidebarOpen && (
            <div className="hidden md:block">
              <LocaleSwitcher
                showText={false}
                withBackground={false}
                dropdownDirection="up"
                dropdownAlign="right"
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
