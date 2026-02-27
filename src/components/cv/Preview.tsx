import { CVData } from "@/src/types/cv";
import { User } from "lucide-react";

interface CVPreviewProps {
    data: CVData;
    forPdf?: boolean;
}

const IconMail = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
    <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>✉</span>
);
const IconPhone = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
    <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>✆</span>
);
const IconPin = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
    <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>⌂</span>
);

const ac = (data: CVData) => data.accent_color || '#4F46E5';

const SkillRow = ({
    name,
    level,
    color,
    compact = false,
    nameClassName = 'text-xs text-gray-700',
    inactiveColor,
    labelWidth,
}: {
    name: string;
    level: number;
    color: string;
    compact?: boolean;
    nameClassName?: string;
    inactiveColor?: string;
    labelWidth?: number;
}) => {
    const segW = compact ? 12 : 16;
    const segH = compact ? 5 : 6;
    const segGap = compact ? 2 : 3;
    const barWidth = segW * 5 + segGap * 4;
    const rowHeight = compact ? 16 : 20;

    return (
        <div
            data-skill-row="true"
            style={{
                display: 'flex',
                alignItems: 'center',
                width: `${(labelWidth ?? (compact ? 64 : 82)) + 7 + barWidth}px`,
                minHeight: `${rowHeight}px`,
            }}
        >
            <span
                data-skill-label="true"
                className={nameClassName}
                style={{
                    width: `${labelWidth ?? (compact ? 64 : 82)}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: `${rowHeight}px`,
                    paddingRight: compact ? '5px' : '7px',
                    flexShrink: 0,
                }}
                title={name}
            >
                {name}
            </span>
            <span
                data-skill-bar="true"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                }}
            >
                {[1, 2, 3, 4, 5].map(i => (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            height: `${segH}px`,
                            width: `${segW}px`,
                            borderRadius: '9999px',
                            backgroundColor: i <= level ? color : (inactiveColor || '#e5e7eb'),
                            marginRight: i < 5 ? `${segGap}px` : '0',
                            verticalAlign: 'middle',
                        }}
                    />
                ))}
            </span>
        </div>
    );
};

const PhotoDisplay = ({ url, size = "md", rounded = "full" }: { url: string; size?: "sm" | "md" | "lg"; rounded?: "full" | "lg" | "none" }) => {
    const sizes = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-28 w-28" };
    const rounding = { full: "rounded-full", lg: "rounded-lg", none: "" };
    return url ? (
        <img src={url} alt="Photo" className={`${sizes[size]} ${rounding[rounded]} object-cover border-2 border-white/20 shrink-0`} />
    ) : (
        <div className={`${sizes[size]} ${rounding[rounded]} bg-gray-200 flex items-center justify-center shrink-0`}>
            <User className="h-8 w-8 text-gray-400" />
        </div>
    );
};

// ─── Template Classique ───────────────────────────────────────────────────────
const ClassicTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white p-8 space-y-5" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', borderTop: `4px solid ${color}` }}>
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    <PhotoDisplay url={data.photo_url} size="lg" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data.full_name || "Votre Nom"}</h1>
                    <p className="text-sm" style={{ color }}>{data.job_title || "Votre Titre"}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                    {data.email && <span className="flex items-center gap-1"><IconMail size={12} /><span>{data.email}</span></span>}
                    {data.phone && <span className="flex items-center gap-1"><IconPhone size={12} /><span>{data.phone}</span></span>}
                    {data.location && <span className="flex items-center gap-1"><IconPin size={12} /><span>{data.location}</span></span>}
                </div>
            </div>

            {data.summary && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color, borderColor: color }}>{`Profil`}</h2>
                    <p className="text-xs text-gray-500 leading-relaxed">{data.summary}</p>
                </div>
            )}

            {data.experiences.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color, borderColor: color }}>Expérience</h2>
                    <div className="space-y-3">
                        {data.experiences.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-900">{exp.position}</p>
                                        <p className="text-xs text-gray-500">{exp.company}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 shrink-0">{exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}</p>
                                </div>
                                {exp.description && <p className="text-[11px] text-gray-500 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.education.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color, borderColor: color }}>Formation</h2>
                    <div className="space-y-2">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-900">{edu.degree}</p>
                                    <p className="text-xs text-gray-500">{edu.school}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 shrink-0">{edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.skills.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color, borderColor: color }}>Compétences</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: '12px', rowGap: '6px', justifyItems: 'start' }}>
                        {data.skills.map(skill => (
                            <SkillRow
                                key={skill.id}
                                name={skill.name}
                                level={skill.level}
                                color={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {data.languages.length > 0 && (
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color, borderColor: color }}>Langues</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {data.languages.map(lang => (
                            <div key={lang.id} className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-gray-700">{lang.name}</span>
                                <span className="text-[10px] text-gray-400">—</span>
                                <span className="text-[10px] text-gray-400">{lang.level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Template Moderne (sidebar colorée) ───────────────────────────────────────
const ModernTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            {/* Sidebar */}
            <div className="p-5 space-y-5 shrink-0 text-white" style={{ width: '198px', minHeight: '842px', boxSizing: 'border-box', backgroundColor: color }}>
                <div className="flex justify-center">
                    <PhotoDisplay url={data.photo_url} size="lg" />
                </div>
                <div className="space-y-1">
                    {data.email && <div className="flex items-center gap-2 text-xs opacity-80"><IconMail size={12} /><span className="min-w-0 break-all">{data.email}</span></div>}
                    {data.phone && <div className="flex items-center gap-2 text-xs opacity-80"><IconPhone size={12} /><span>{data.phone}</span></div>}
                    {data.location && <div className="flex items-center gap-2 text-xs opacity-80"><IconPin size={12} /><span>{data.location}</span></div>}
                </div>
                {data.skills.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">Compétences</h3>
                        <div className="space-y-2">
                            {data.skills.map(skill => (
                                <SkillRow
                                    key={skill.id}
                                    name={skill.name}
                                    level={skill.level}
                                    color="white"
                                    compact
                                    nameClassName="text-[11px] opacity-80"
                                    inactiveColor="rgba(255,255,255,0.2)"
                                />
                            ))}
                        </div>
                    </div>
                )}
                {data.languages.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">Langues</h3>
                        <div className="space-y-1">
                            {data.languages.map(lang => (
                                <div key={lang.id} className="flex justify-between gap-1">
                                    <span className="text-[11px] opacity-80">{lang.name}</span>
                                    <span className="text-[10px] opacity-60 shrink-0">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Main */}
            <div className="p-6 space-y-5" style={{ width: '397px', boxSizing: 'border-box' }}>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data.full_name || "Votre Nom"}</h1>
                    <p className="text-sm font-medium" style={{ color }}>{data.job_title || "Votre Titre"}</p>
                </div>
                {data.summary && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color }}>Profil</h2>
                        <p className="text-xs text-gray-500 leading-relaxed">{data.summary}</p>
                    </div>
                )}
                {data.experiences.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Expérience</h2>
                        <div className="space-y-3">
                            {data.experiences.map(exp => (
                                <div key={exp.id}>
                                    <p className="text-xs font-semibold text-gray-900">{exp.position}</p>
                                    <p className="text-xs text-gray-500">{exp.company}{exp.company && (exp.start_date || exp.end_date) ? ' · ' : ''}{exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}</p>
                                    {exp.description && <p className="text-[11px] text-gray-500 mt-1">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.education.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Formation</h2>
                        <div className="space-y-2">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <p className="text-xs font-semibold text-gray-900">{edu.degree}</p>
                                    <p className="text-xs text-gray-500">{edu.school}{edu.school && (edu.start_date || edu.end_date) ? ' · ' : ''}{edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Template Créatif (header dégradé) ───────────────────────────────────────
const CreativeTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            <div className="p-6 flex items-center gap-5 text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                <PhotoDisplay url={data.photo_url} size="lg" />
                <div className="min-w-0">
                    <h1 className="text-2xl font-bold">{data.full_name || "Votre Nom"}</h1>
                    <p className="text-sm opacity-90">{data.job_title || "Votre Titre"}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs opacity-80">
                        {data.email && <span className="flex items-center gap-1"><IconMail size={12} /><span className="min-w-0">{data.email}</span></span>}
                        {data.phone && <span className="flex items-center gap-1"><IconPhone size={12} /><span>{data.phone}</span></span>}
                        {data.location && <span className="flex items-center gap-1"><IconPin size={12} /><span>{data.location}</span></span>}
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-5">
                {data.summary && (
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color }}>Profil</h2>
                        <p className="text-xs text-gray-500 leading-relaxed">{data.summary}</p>
                    </div>
                )}
                <div className="flex gap-5">
                    <div className="space-y-5" style={{ width: '360px' }}>
                        {data.experiences.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Expérience</h2>
                                <div className="space-y-3">
                                    {data.experiences.map(exp => (
                                        <div key={exp.id}>
                                            <p className="text-xs font-semibold text-gray-900">{exp.position}</p>
                                            <p className="text-xs text-gray-500">{exp.company}{exp.company && (exp.start_date || exp.end_date) ? ' · ' : ''}{exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}</p>
                                            {exp.description && <p className="text-[11px] text-gray-500 mt-1">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.education.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Formation</h2>
                                <div className="space-y-2">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <p className="text-xs font-semibold text-gray-900">{edu.degree}</p>
                                            <p className="text-xs text-gray-500">{edu.school}{edu.school && (edu.start_date || edu.end_date) ? ' · ' : ''}{edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-5" style={{ width: '147px' }}>
                        {data.skills.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Compétences</h2>
                                <div className="space-y-2">
                                    {data.skills.map(skill => (
                                        <SkillRow
                                            key={skill.id}
                                            name={skill.name}
                                            level={skill.level}
                                            color={color}
                                            compact
                                            nameClassName="text-[11px] text-gray-700"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.languages.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color }}>Langues</h2>
                                <div className="space-y-1">
                                    {data.languages.map(lang => (
                                        <div key={lang.id}>
                                            <p className="text-[11px] font-medium text-gray-700">{lang.name}</p>
                                            <p className="text-[10px] text-gray-400">{lang.level}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Template Compact (minimaliste, 2 colonnes) ───────────────────────────────
const CompactTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            {/* Header bande fine */}
            <div className="px-8 py-5 flex items-center gap-5" style={{ borderLeft: `6px solid ${color}` }}>
                <PhotoDisplay url={data.photo_url} size="md" rounded="lg" />
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{data.full_name || "Votre Nom"}</h1>
                    <p className="text-sm font-semibold mb-2" style={{ color }}>{data.job_title || "Votre Titre"}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-gray-500">
                        {data.email && <span className="flex items-center gap-1"><IconMail size={10} />{data.email}</span>}
                        {data.phone && <span className="flex items-center gap-1"><IconPhone size={10} />{data.phone}</span>}
                        {data.location && <span className="flex items-center gap-1"><IconPin size={10} />{data.location}</span>}
                    </div>
                </div>
            </div>
            <div className="px-8 py-4 flex gap-6">
                {/* Left col */}
                <div className="flex-1 space-y-4 min-w-0">
                    {data.summary && (
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color }}>À propos</h2>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{data.summary}</p>
                        </div>
                    )}
                    {data.experiences.length > 0 && (
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Expérience</h2>
                            <div className="space-y-2.5">
                                {data.experiences.map(exp => (
                                    <div key={exp.id} className="flex gap-3">
                                        <div className="w-1 shrink-0 rounded-full mt-1" style={{ backgroundColor: color, minHeight: '14px' }} />
                                        <div className="min-w-0">
                                            <div className="flex justify-between gap-1">
                                                <p className="text-[11px] font-semibold text-gray-900">{exp.position}</p>
                                                <p className="text-[10px] text-gray-400 shrink-0">{exp.start_date}{exp.end_date ? `–${exp.end_date}` : ''}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-500">{exp.company}</p>
                                            {exp.description && <p className="text-[10px] text-gray-400 mt-0.5">{exp.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.education.length > 0 && (
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Formation</h2>
                            <div className="space-y-2">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="flex gap-3">
                                        <div className="w-1 shrink-0 rounded-full mt-1" style={{ backgroundColor: color, minHeight: '14px' }} />
                                        <div className="min-w-0">
                                            <div className="flex justify-between gap-1">
                                                <p className="text-[11px] font-semibold text-gray-900">{edu.degree}</p>
                                                <p className="text-[10px] text-gray-400 shrink-0">{edu.start_date}{edu.end_date ? `–${edu.end_date}` : ''}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-500">{edu.school}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Right col */}
                <div className="space-y-4" style={{ width: '150px' }}>
                    {data.skills.length > 0 && (
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Compétences</h2>
                            <div className="space-y-2">
                                {data.skills.map(skill => (
                                    <SkillRow
                                        key={skill.id}
                                        name={skill.name}
                                        level={skill.level}
                                        color={color}
                                        compact
                                        nameClassName="text-[10px] text-gray-700"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {data.languages.length > 0 && (
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>Langues</h2>
                            <div className="space-y-1">
                                {data.languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between gap-1">
                                        <span className="text-[10px] text-gray-700">{lang.name}</span>
                                        <span className="text-[10px] text-gray-400 shrink-0">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Template Executive (élégant, noir & couleur) ────────────────────────────
const ExecutiveTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            <div className="px-8 pt-8 pb-5">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{data.full_name || "Votre Nom"}</h1>
                        <p className="text-base font-semibold mt-1" style={{ color }}>{data.job_title || "Votre Titre"}</p>
                    </div>
                    <PhotoDisplay url={data.photo_url} size="md" rounded="lg" />
                </div>
                <div className="h-0.5 mt-4" style={{ backgroundColor: color }} />
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-gray-500">
                    {data.email && <span className="flex items-center gap-1"><IconMail size={12} />{data.email}</span>}
                    {data.phone && <span className="flex items-center gap-1"><IconPhone size={12} />{data.phone}</span>}
                    {data.location && <span className="flex items-center gap-1"><IconPin size={12} />{data.location}</span>}
                </div>
            </div>
            <div className="px-8 pb-8 space-y-5">
                {data.summary && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${color}12` }}>
                        <p className="text-xs text-gray-600 leading-relaxed">{data.summary}</p>
                    </div>
                )}
                <div className="flex gap-6">
                    <div className="flex-1 space-y-4 min-w-0">
                        {data.experiences.length > 0 && (
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color, borderColor: color }}>Expérience</h2>
                                <div className="space-y-3">
                                    {data.experiences.map(exp => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between gap-2">
                                                <p className="text-xs font-bold text-gray-900">{exp.position}</p>
                                                <p className="text-[10px] text-gray-400 shrink-0">{exp.start_date}{exp.start_date && exp.end_date ? '–' : ''}{exp.end_date}</p>
                                            </div>
                                            <p className="text-[11px] font-medium" style={{ color }}>{exp.company}</p>
                                            {exp.description && <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.education.length > 0 && (
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color, borderColor: color }}>Formation</h2>
                                <div className="space-y-2">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="flex justify-between gap-2">
                                                <p className="text-xs font-bold text-gray-900">{edu.degree}</p>
                                                <p className="text-[10px] text-gray-400 shrink-0">{edu.start_date}{edu.start_date && edu.end_date ? '–' : ''}{edu.end_date}</p>
                                            </div>
                                            <p className="text-[11px] font-medium" style={{ color }}>{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4" style={{ width: '140px' }}>
                        {data.skills.length > 0 && (
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color, borderColor: color }}>Compétences</h2>
                                <div className="space-y-2">
                                    {data.skills.map(skill => (
                                        <SkillRow
                                            key={skill.id}
                                            name={skill.name}
                                            level={skill.level}
                                            color={color}
                                            compact
                                            nameClassName="text-[10px] text-gray-700"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.languages.length > 0 && (
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest pb-1 mb-2 border-b-2" style={{ color, borderColor: color }}>Langues</h2>
                                <div className="space-y-1.5">
                                    {data.languages.map(lang => (
                                        <div key={lang.id}>
                                            <p className="text-[10px] font-semibold text-gray-700">{lang.name}</p>
                                            <p className="text-[10px] text-gray-400">{lang.level}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Template Sidebar Gauche (sobre) ─────────────────────────────────────────
const SidebarTemplate = ({ data, forPdf }: CVPreviewProps) => {
    const color = ac(data);
    return (
        <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            {/* Sidebar gauche gris clair */}
            <div className="p-5 space-y-5 shrink-0" style={{ width: '185px', minHeight: '842px', backgroundColor: '#f8f9fa', borderRight: `3px solid ${color}` }}>
                <div className="flex justify-center">
                    <PhotoDisplay url={data.photo_url} size="lg" rounded="lg" />
                </div>
                <div>
                    <h1 className="text-sm font-bold text-gray-900 text-center leading-tight">{data.full_name || "Votre Nom"}</h1>
                    <p className="text-[10px] text-center font-semibold mt-0.5" style={{ color }}>{data.job_title || "Votre Titre"}</p>
                </div>
                <div className="space-y-1 text-[10px] text-gray-600">
                    {data.email && <div className="flex items-center gap-1.5"><IconMail size={10} color={color} /><span className="break-all">{data.email}</span></div>}
                    {data.phone && <div className="flex items-center gap-1.5"><IconPhone size={10} color={color} /><span>{data.phone}</span></div>}
                    {data.location && <div className="flex items-center gap-1.5"><IconPin size={10} color={color} /><span>{data.location}</span></div>}
                </div>
                {data.skills.length > 0 && (
                    <div>
                        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color }}>Compétences</h3>
                        <div className="space-y-1.5">
                            {data.skills.map(skill => (
                                <SkillRow
                                    key={skill.id}
                                    name={skill.name}
                                    level={skill.level}
                                    color={color}
                                    compact
                                    nameClassName="text-[10px] text-gray-700"
                                />
                            ))}
                        </div>
                    </div>
                )}
                {data.languages.length > 0 && (
                    <div>
                        <h3 className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color }}>Langues</h3>
                        <div className="space-y-1">
                            {data.languages.map(lang => (
                                <div key={lang.id} className="flex justify-between gap-1">
                                    <span className="text-[10px] text-gray-700">{lang.name}</span>
                                    <span className="text-[9px] text-gray-400 shrink-0">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Main content */}
            <div className="p-6 space-y-4" style={{ width: '410px', boxSizing: 'border-box' }}>
                {data.summary && (
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-1.5 border-b" style={{ color, borderColor: `${color}40` }}>Profil</h2>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{data.summary}</p>
                    </div>
                )}
                {data.experiences.length > 0 && (
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ color, borderColor: `${color}40` }}>Expérience professionnelle</h2>
                        <div className="space-y-3">
                            {data.experiences.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between gap-2">
                                        <p className="text-[11px] font-semibold text-gray-900">{exp.position}</p>
                                        <p className="text-[10px] text-gray-400 shrink-0">{exp.start_date}{exp.start_date && exp.end_date ? '–' : ''}{exp.end_date}</p>
                                    </div>
                                    <p className="text-[10px] font-medium" style={{ color }}>{exp.company}</p>
                                    {exp.description && <p className="text-[10px] text-gray-500 mt-0.5">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.education.length > 0 && (
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{ color, borderColor: `${color}40` }}>Formation</h2>
                        <div className="space-y-2">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between gap-2">
                                        <p className="text-[11px] font-semibold text-gray-900">{edu.degree}</p>
                                        <p className="text-[10px] text-gray-400 shrink-0">{edu.start_date}{edu.start_date && edu.end_date ? '–' : ''}{edu.end_date}</p>
                                    </div>
                                    <p className="text-[10px] font-medium" style={{ color }}>{edu.school}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Router ───────────────────────────────────────────────────────────────────
const CVPreview = ({ data, forPdf = false }: CVPreviewProps) => {
    switch (data.template) {
        case 'modern': return <ModernTemplate data={data} forPdf={forPdf} />;
        case 'creative': return <CreativeTemplate data={data} forPdf={forPdf} />;
        case 'compact': return <CompactTemplate data={data} forPdf={forPdf} />;
        case 'executive': return <ExecutiveTemplate data={data} forPdf={forPdf} />;
        case 'sidebar': return <SidebarTemplate data={data} forPdf={forPdf} />;
        default: return <ClassicTemplate data={data} forPdf={forPdf} />;
    }
};

export default CVPreview;
