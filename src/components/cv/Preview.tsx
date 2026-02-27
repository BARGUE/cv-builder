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

const SkillDots = ({ level, color, inactiveColor = '#e2e8f0' }: { level: number; color: string; inactiveColor?: string }) => (
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

const SkillRow = ({
  name,
  level,
  color,
  compact = false,
  nameClassName = 'text-xs text-gray-700',
  inactiveColor,
  labelWidth,
  forPdf = false,
}: {
  name: string;
  level: number;
  color: string;
  compact?: boolean;
  nameClassName?: string;
  inactiveColor?: string;
  labelWidth?: number;
  forPdf?: boolean;
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
        display: 'table',
        tableLayout: 'fixed',
        width: `${(labelWidth ?? (compact ? 64 : 82)) + 7 + barWidth}px`,
        minHeight: `${rowHeight}px`,
      }}
    >
      <span
        data-skill-label="true"
        className={nameClassName}
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
          width: `${labelWidth ?? (compact ? 64 : 82)}px`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 'normal',
          paddingRight: compact ? '5px' : '7px',
          paddingBottom: forPdf ? '15px' : '0px',
        }}
        title={name}
      >
        {name}
      </span>
      <span
        data-skill-bar="true"
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
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

const PhotoDisplay = ({ url, size = "md", rounded = "full", border }: { url: string; size?: "sm" | "md" | "lg"; rounded?: "full" | "lg" | "none"; border?: string }) => {
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

const SectionTitle = ({ children, color, variant = "line" }: { children: React.ReactNode; color: string; variant?: "line" | "dot" | "filled" | "underline" }) => {
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

// ─── Template Classique ───────────────────────────────────────────────────────
const ClassicTemplate = ({ data, forPdf }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ padding: '32px 36px 24px', borderBottom: `3px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <PhotoDisplay url={data.photo_url} size="lg" border={`3px solid ${color}30`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>{data.full_name || "Votre Nom"}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data.job_title || "Votre Titre"}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
              {data.email && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconMail size={11} color={color} />{data.email}</span>}
              {data.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconPhone size={11} color={color} />{data.phone}</span>}
              {data.location && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconPin size={11} color={color} />{data.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 36px 32px', display: 'flex', gap: '28px' }}>
        {/* Main col */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {data.summary && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Profil</SectionTitle>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}

          {data.experiences.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Expérience</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.experiences.map(exp => (
                  <div key={exp.id} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>{exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}</p>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                    {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <SectionTitle color={color} variant="filled">Formation</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.education.map(edu => (
                  <div key={edu.id} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}</p>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side col */}
        <div style={{ width: '155px', flexShrink: 0 }}>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Compétences</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.skills.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                    <SkillDots level={skill.level} color={color} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <SectionTitle color={color} variant="filled">Langues</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.languages.map(lang => (
                  <div key={lang.id}>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{lang.name}</p>
                    <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{lang.level}</p>
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

// ─── Template Moderne (sidebar colorée) ───────────────────────────────────────
const ModernTemplate = ({ data, forPdf }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', minHeight: '842px', boxSizing: 'border-box', background: `linear-gradient(180deg, ${color}, ${color}dd)`, padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhotoDisplay url={data.photo_url} size="lg" border="3px solid rgba(255,255,255,0.3)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconMail size={11} color="rgba(255,255,255,0.6)" /><span style={{ wordBreak: 'break-all' }}>{data.email}</span></div>}
          {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconPhone size={11} color="rgba(255,255,255,0.6)" /><span>{data.phone}</span></div>}
          {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconPin size={11} color="rgba(255,255,255,0.6)" /><span>{data.location}</span></div>}
        </div>
        {data.skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Compétences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.skills.map(skill => (
                <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                  <SkillDots level={skill.level} color="white" inactiveColor="rgba(255,255,255,0.2)" />
                </div>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Langues</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.languages.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}>{lang.name}</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ width: '395px', boxSizing: 'border-box', padding: '28px 24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data.full_name || "Votre Nom"}</h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data.job_title || "Votre Titre"}</p>
        </div>
        {data.summary && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">Profil</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data.experiences.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">Expérience</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px', whiteSpace: 'nowrap' }}>{exp.start_date}{exp.start_date && exp.end_date ? ' — ' : ''}{exp.end_date}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', marginTop: '1px' }}>{exp.company}</p>
                  {exp.description && <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <SectionTitle color={color} variant="dot">Formation</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>{edu.start_date}{edu.start_date && edu.end_date ? ' — ' : ''}{edu.end_date}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</p>
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
      <div style={{ padding: '28px 32px', background: `linear-gradient(135deg, ${color}, ${color}cc, ${color}88)`, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <PhotoDisplay url={data.photo_url} size="lg" border="3px solid rgba(255,255,255,0.4)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{data.full_name || "Votre Nom"}</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: '2px' }}>{data.job_title || "Votre Titre"}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px' }}>
            {data.email && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px' }}><IconMail size={10} />{data.email}</span>}
            {data.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px' }}><IconPhone size={10} />{data.phone}</span>}
            {data.location && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px' }}><IconPin size={10} />{data.location}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 32px 32px' }}>
        {data.summary && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: `${color}08`, borderRadius: '10px', borderLeft: `3px solid ${color}` }}>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {data.experiences.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionTitle color={color} variant="underline">Expérience</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.experiences.map(exp => (
                    <div key={exp.id}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}</span>
                        {(exp.start_date || exp.end_date) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {exp.start_date}{exp.end_date ? ` — ${exp.end_date}` : ''}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.education.length > 0 && (
              <div>
                <SectionTitle color={color} variant="underline">Formation</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</span>
                        {(edu.start_date || edu.end_date) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {edu.start_date}{edu.end_date ? ` — ${edu.end_date}` : ''}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '155px', flexShrink: 0 }}>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionTitle color={color} variant="underline">Compétences</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.skills.map(skill => (
                    <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                      <SkillDots level={skill.level} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <SectionTitle color={color} variant="underline">Langues</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {data.languages.map(lang => (
                    <div key={lang.id}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{lang.name}</p>
                      <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{lang.level}</p>
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

// ─── Template Compact (minimaliste, timeline) ─────────────────────────────────
const CompactTemplate = ({ data, forPdf }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <PhotoDisplay url={data.photo_url} size="md" rounded="lg" border={`3px solid ${color}20`} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{data.full_name || "Votre Nom"}</h1>
          <p style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '2px' }}>{data.job_title || "Votre Titre"}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
            {data.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}><IconMail size={10} color={color} />{data.email}</span>}
            {data.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}><IconPhone size={10} color={color} />{data.phone}</span>}
            {data.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b' }}><IconPin size={10} color={color} />{data.location}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 36px 32px', display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {data.summary && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">À propos</SectionTitle>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}
          {data.experiences.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">Expérience</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.experiences.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.start_date}{exp.end_date ? ` – ${exp.end_date}` : ''}</p>
                      </div>
                      <p style={{ fontSize: '10px', color: '#64748b' }}>{exp.company}</p>
                      {exp.description && <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.5 }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <SectionTitle color={color} variant="line">Formation</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.education.map(edu => (
                  <div key={edu.id} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.start_date}{edu.end_date ? ` – ${edu.end_date}` : ''}</p>
                      </div>
                      <p style={{ fontSize: '10px', color: '#64748b' }}>{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ width: '148px', flexShrink: 0 }}>
          {data.skills.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">Compétences</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.skills.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#475569', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                    <SkillDots level={skill.level} color={color} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <SectionTitle color={color} variant="line">Langues</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data.languages.map(lang => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569' }}>{lang.name}</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{lang.level}</span>
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

// ─── Template Executive (premium, noir & couleur) ────────────────────────────
const ExecutiveTemplate = ({ data, forPdf }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', backgroundColor: '#fafbfc' }}>
      <div style={{ padding: '32px 36px 24px', backgroundColor: '#1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{data.full_name || "Votre Nom"}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{data.job_title || "Votre Titre"}</p>
          </div>
          <PhotoDisplay url={data.photo_url} size="md" rounded="lg" border={`3px solid ${color}`} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${color}40` }}>
          {data.email && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconMail size={11} color={color} />{data.email}</span>}
          {data.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconPhone size={11} color={color} />{data.phone}</span>}
          {data.location && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconPin size={11} color={color} />{data.location}</span>}
        </div>
      </div>
      <div style={{ padding: '24px 36px 32px' }}>
        {data.summary && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'white', borderRadius: '8px', borderLeft: `3px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {data.experiences.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Expérience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.experiences.map(exp => (
                    <div key={exp.id} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.start_date}{exp.start_date && exp.end_date ? ' – ' : ''}{exp.end_date}</span>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                      {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.education.length > 0 && (
              <div>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Formation</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.education.map(edu => (
                    <div key={edu.id} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.start_date}{edu.start_date && edu.end_date ? ' – ' : ''}{edu.end_date}</span>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color }}>{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '145px', flexShrink: 0 }}>
            {data.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Compétences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.skills.map(skill => (
                    <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                      <SkillDots level={skill.level} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Langues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.languages.map(lang => (
                    <div key={lang.id}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: '#334155' }}>{lang.name}</p>
                      <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{lang.level}</p>
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

// ─── Template Sidebar Gauche ─────────────────────────────────────────────────
const SidebarTemplate = ({ data, forPdf }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ width: '190px', minHeight: '842px', boxSizing: 'border-box', backgroundColor: '#f8fafc', borderRight: `2px solid ${color}20`, padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhotoDisplay url={data.photo_url} size="lg" rounded="lg" border={`3px solid ${color}30`} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}>{data.full_name || "Votre Nom"}</h1>
          <p style={{ fontSize: '10px', fontWeight: 600, color, marginTop: '3px' }}>{data.job_title || "Votre Titre"}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconMail size={10} color={color} /><span style={{ wordBreak: 'break-all' }}>{data.email}</span></div>}
          {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPhone size={10} color={color} /><span>{data.phone}</span></div>}
          {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPin size={10} color={color} /><span>{data.location}</span></div>}
        </div>
        {data.skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>Compétences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.skills.map(skill => (
                <div key={skill.id}>
                  <span style={{ fontSize: '10px', color: '#475569', display: 'block', marginBottom: '3px' }}>{skill.name}</span>
                  <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, backgroundColor: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>Langues</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {data.languages.map(lang => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569' }}>{lang.name}</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ width: '405px', boxSizing: 'border-box', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {data.summary && (
          <div>
            <SectionTitle color={color} variant="filled">Profil</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data.experiences.length > 0 && (
          <div>
            <SectionTitle color={color} variant="filled">Expérience professionnelle</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.start_date}{exp.start_date && exp.end_date ? ' – ' : ''}{exp.end_date}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                  {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <SectionTitle color={color} variant="filled">Formation</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.start_date}{edu.start_date && edu.end_date ? ' – ' : ''}{edu.end_date}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</p>
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
    case 'modern':    return <ModernTemplate data={data} forPdf={forPdf} />;
    case 'creative':  return <CreativeTemplate data={data} forPdf={forPdf} />;
    case 'compact':   return <CompactTemplate data={data} forPdf={forPdf} />;
    case 'executive': return <ExecutiveTemplate data={data} forPdf={forPdf} />;
    case 'sidebar':   return <SidebarTemplate data={data} forPdf={forPdf} />;
    default:          return <ClassicTemplate data={data} forPdf={forPdf} />;
  }
};

export default CVPreview;
