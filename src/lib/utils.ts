import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CVData } from "@/src/types/cv";

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

export const ACCENT_COLORS = [
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Bleu', value: '#2563EB' },
    { label: 'Vert', value: '#16A34A' },
    { label: 'Rouge', value: '#DC2626' },
    { label: 'Orange', value: '#EA580C' },
    { label: 'Violet', value: '#7C3AED' },
    { label: 'Rose', value: '#DB2777' },
    { label: 'Gris', value: '#374151' },
];

export const TEMPLATES: { id: CVData['template']; label: string }[] = [
    { id: 'classic', label: 'Classique' },
    { id: 'modern', label: 'Moderne' },
    { id: 'creative', label: 'Créatif' },
    { id: 'compact', label: 'Compact' },
    { id: 'executive', label: 'Executive' },
    { id: 'sidebar', label: 'Sidebar' },
    { id: 'minimaliste', label: 'Minimaliste' },
    { id: 'playfair', label: 'Créatif Playfair' },
    { id: 'tech', label: 'Tech' },
];