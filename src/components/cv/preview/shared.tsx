"use client";

import { useTranslations } from "next-intl";
import { LANGUAGE_LEVELS, type CVData, type LanguageLevel } from "@/src/types/cv";
import { MailIcon, MapPinIcon, PhoneIcon, User } from "lucide-react";

export const IconMail = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><MailIcon /></span>
);
export const IconPhone = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><PhoneIcon /></span>
);
export const IconPin = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><MapPinIcon /></span>
);

export const ac = (data: CVData) => data?.accentColor || '#4F46E5';

export const initials = (name: string) =>
  name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '';

/** Libellés traduits + formatage des dates ("MM/YYYY" -> "Jan 2024"). */
export const usePreviewLabels = () => {
  const t = useTranslations("preview");
  const tCommon = useTranslations("common");
  const months = useTranslations("date").raw("monthsShort") as string[];
  const levelLabels = useTranslations("cvEditor").raw("languageLevels") as string[];

  const fmtDate = (d: string) => {
    const match = /^(\d{1,2})\/(\d{4})$/.exec(d.trim());
    return match ? `${months[Number(match[1]) - 1] ?? match[1]} ${match[2]}` : d;
  };

  return {
    profile: t("profile"),
    about: t("about"),
    experience: t("experience"),
    experienceFull: t("experienceFull"),
    education: t("education"),
    skills: t("skills"),
    languages: t("languages"),
    yourName: tCommon("yourName"),
    yourTitle: tCommon("yourTitle"),
    level: (v: string) => levelLabels[LANGUAGE_LEVELS.indexOf(v as LanguageLevel)] ?? v,
    dateRange: (start: string, end: string) => {
      if (!start && !end) return "";
      if (!start) return fmtDate(end);
      return `${fmtDate(start)} — ${end ? fmtDate(end) : tCommon("present")}`;
    },
  };
};

export const SkillDots = ({ level, color, inactiveColor = '#e2e8f0' }: { level: number; color: string; inactiveColor?: string }) => (
  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <div
        key={i}
        style={{
          height: '8px',
          width: '8px',
          borderRadius: '50%',
          backgroundColor: i <= level ? color : inactiveColor,
        }}
      />
    ))}
  </div>
);

export const PhotoDisplay = ({ url, size = "md", rounded = "full", border }: { url: string; size?: "sm" | "md" | "lg"; rounded?: "full" | "lg" | "none"; border?: string }) => {
  const sizes = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-28 w-28" };
  const rounding = { full: "rounded-full", lg: "rounded-lg", none: "" };
  return url ? (
    <img src={url} alt="Photo" className={`${sizes[size]} ${rounding[rounded]} object-cover shrink-0`} style={{ border: border || '3px solid rgba(255,255,255,0.3)' }} />
  ) : (
    <div className={`${sizes[size]} ${rounding[rounded]} bg-gray-100 flex items-center justify-center shrink-0`} style={{ border: border || '3px solid rgba(0,0,0,0.05)' }}>
      <User className="h-8 w-8 text-gray-300" />
    </div>
  );
};

export const SectionTitle = ({ children, color, variant = "line" }: { children: React.ReactNode; color: string; variant?: "line" | "dot" | "filled" | "underline" }) => {
  if (variant === "filled") return (
    <div className="flex items-center gap-2 mb-3">
      <div style={{ width: '3px', height: '16px', borderRadius: '2px', backgroundColor: color, flexShrink: 0 }} />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800">{children}</h2>
    </div>
  );
  if (variant === "dot") return (
    <div className="flex items-center gap-2 mb-3">
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800">{children}</h2>
    </div>
  );
  if (variant === "underline") return (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 pb-1.5 mb-3" style={{ borderBottom: `2px solid ${color}` }}>{children}</h2>
  );
  return (
    <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] pb-1.5 mb-3 border-b border-gray-200" style={{ color }}>{children}</h2>
  );
};
