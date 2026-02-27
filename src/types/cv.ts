export interface CVData {
    id?: string;
    user_id?: string;
    title: string;
    template: 'classic' | 'modern' | 'creative' | 'compact' | 'executive' | 'sidebar';
    accent_color: string;
    photo_url: string;
    full_name: string;
    job_title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    current_step?: number;
    completed?: boolean;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    start_date: string;
    end_date: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
}

export interface Language {
    id: string;
    name: string;
    level: string;
}

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

export const defaultCVData: CVData = {
    title: 'Mon CV',
    template: 'classic',
    accent_color: '#4F46E5',
    photo_url: '',
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    current_step: 1,
    completed: false,
};
