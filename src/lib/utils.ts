import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const TEMPLATE_COLORS: Record<string, string> = {
    classic: "#3b82f6",
    modern: "#8b5cf6",
    minimal: "#10b981",
    creative: "#f59e0b",
    professional: "#ef4444",
    elegant: "#ec4899",
};

export const getTemplateColor = (name: string, index: number) => {
    const fallback = ["#6366f1", "#14b8a6", "#f97316", "#e11d48", "#0ea5e9"];
    return TEMPLATE_COLORS[name.toLowerCase()] || fallback[index % fallback.length];
};

/** `key` référence le namespace i18n `accentColors`. */
export const ACCENT_COLORS = [
    { key: "indigo", value: "#4F46E5" },
    { key: "blue", value: "#2563EB" },
    { key: "green", value: "#16A34A" },
    { key: "red", value: "#DC2626" },
    { key: "orange", value: "#EA580C" },
    { key: "violet", value: "#7C3AED" },
    { key: "pink", value: "#DB2777" },
    { key: "gray", value: "#374151" },
] as const;
