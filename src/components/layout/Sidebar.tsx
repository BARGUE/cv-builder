"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { FileText, LogOut, User, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/src/components/ui/LocaleSwitcher";

interface SidebarProps {
  sidebarOpen: boolean;
  activeRoute: "dashboard" | "account";
  user?: { email?: string | null };
  onLogout: () => void;
}

export function Sidebar({ sidebarOpen, activeRoute, user, onLogout }: SidebarProps) {
  const t = useTranslations("sidebar");

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
      className={`${sidebarOpen ? "w-56" : "w-16"} bg-[hsl(235,40%,14%)] flex flex-col fixed inset-y-0 left-0 z-20 transition-all duration-300`}
    >
      <div className={`px-4 py-6 ${!sidebarOpen && "px-3"}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 text-white">
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          {sidebarOpen && (
            <span className="font-black text-sm tracking-tight">CVBuilder</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                item.active
                  ? "font-semibold bg-white/10 text-white"
                  : "font-medium text-white/50 hover:text-white hover:bg-white/5"
              } ${!sidebarOpen ? "justify-center px-0" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 space-y-1.5">
        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          className={`flex items-center justify-start gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors w-full ${
            !sidebarOpen ? "justify-center px-0" : ""
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {sidebarOpen && t("logout")}
        </Button>
        <div className={`flex items-center ${!sidebarOpen ? "justify-center" : "gap-1"}`}>
          <Link
            href="/account"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors min-w-0 flex-1 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-white/60" />
            </div>
            {sidebarOpen && (
              <span className="text-xs text-white/40 truncate">
                {user?.email ?? ""}
              </span>
            )}
          </Link>
          {sidebarOpen && (
            <LocaleSwitcher
              showText={false}
              withBackground={false}
              dropdownDirection="up"
              dropdownAlign="right"
            />
          )}
        </div>
      </div>
    </aside>
  );
}
