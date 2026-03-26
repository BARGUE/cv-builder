import { CVData } from "@/src/types/cv";
import type { CVPreviewProps } from "@/src/components/cv/types";
import { MailIcon, MapPinIcon, PhoneIcon, User } from "lucide-react";

const IconMail = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><MailIcon /></span>
);
const IconPhone = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><PhoneIcon /></span>
);
const IconPin = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <span style={{ fontSize: `${size}px`, lineHeight: 1, color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}><MapPinIcon /></span>
);

const ac = (data: CVData) => data?.accentColor || '#4F46E5';

const initials = (name: string) =>
  name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const fmtDate = (d: string) => {
  if (!d) return 'Présent';
  const [m, y] = d.split('/');
  return `${MONTHS[parseInt(m, 10) - 1] || m} ${y}`;
};
const dateRange = (s: string, e: string) => fmtDate(s) + (s && e ? ' — ' : '') + fmtDate(e);

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
const ClassicTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ padding: '32px 36px 24px', borderBottom: `3px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <PhotoDisplay url={data?.photoUrl} size="lg" border={`3px solid ${color}30`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>{data?.fullName || "Votre Nom"}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data?.jobTitle || "Votre Titre"}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
              {data?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconMail size={11} color={color} />{data.email}</span>}
              {data?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconPhone size={11} color={color} />{data.phone}</span>}
              {data?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#64748b' }}><IconPin size={11} color={color} />{data.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 36px 32px', display: 'flex', gap: '28px' }}>
        {/* Main col */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {data?.summary && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Profil</SectionTitle>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data?.summary}</p>
            </div>
          )}

          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Expérience</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data?.experiences?.map((exp, index) => (
                  <div key={index} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>{exp.startDate}{exp.startDate && exp.endDate ? ' — ' : ''}{exp.endDate}</p>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                    {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.education?.length > 0 && (
            <div>
              <SectionTitle color={color} variant="filled">Formation</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data?.education?.map((edu, index) => (
                  <div key={index} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{edu.startDate}{edu.startDate && edu.endDate ? ' — ' : ''}{edu.endDate}</p>
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
          {data?.skills?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">Compétences</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data?.skills?.map((skill, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                    <SkillDots level={skill.level} color={color} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.languages?.length > 0 && (
            <div>
              <SectionTitle color={color} variant="filled">Langues</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data?.languages?.map((lang, index) => (
                  <div key={index}>
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
const ModernTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '1055px', boxSizing: 'border-box' }}>
      {/* Sidebar */}
      <div style={{ width: '200px', minHeight: '1055px', boxSizing: 'border-box', background: `linear-gradient(180deg, ${color}, ${color}dd)`, padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhotoDisplay url={data?.photoUrl} size="lg" border="3px solid rgba(255,255,255,0.3)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data?.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconMail size={11} color="rgba(255,255,255,0.6)" /><span style={{ wordBreak: 'break-all' }}>{data?.email}</span></div>}
          {data?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconPhone size={11} color="rgba(255,255,255,0.6)" /><span>{data?.phone}</span></div>}
          {data?.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}><IconPin size={11} color="rgba(255,255,255,0.6)" /><span>{data?.location}</span></div>}
        </div>
        {data?.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Compétences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data?.skills?.map((skill, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                  <SkillDots level={skill.level} color="white" inactiveColor="rgba(255,255,255,0.2)" />
                </div>
              ))}
            </div>
          </div>
        )}
        {data?.languages?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Langues</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data?.languages?.map((lang, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
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
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data?.fullName || "Votre Nom"}</h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data?.jobTitle || "Votre Titre"}</p>
        </div>
        {data.summary && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">Profil</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data?.experiences?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">Expérience</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.experiences?.map((exp, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px', whiteSpace: 'nowrap' }}>{exp.startDate}{exp.startDate && exp.endDate ? ' — ' : ''}{exp.endDate}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: '#64748b', marginTop: '1px' }}>{exp.company}</p>
                  {exp.description && <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {data?.education?.length > 0 && (
          <div>
            <SectionTitle color={color} variant="dot">Formation</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.education?.map((edu, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>{edu.startDate}{edu.startDate && edu.endDate ? ' — ' : ''}{edu.endDate}</span>
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
const CreativeTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 32px', background: `linear-gradient(135deg, ${color}, ${color}cc, ${color}88)`, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <PhotoDisplay url={data.photoUrl} size="lg" border="3px solid rgba(255,255,255,0.4)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{data.fullName || "Votre Nom"}</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: '2px' }}>{data.jobTitle || "Votre Titre"}</p>
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
            {data?.experiences?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionTitle color={color} variant="underline">Expérience</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data?.experiences?.map((exp, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}</span>
                        {(exp.startDate || exp.endDate) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.education?.length > 0 && (
              <div>
                <SectionTitle color={color} variant="underline">Formation</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</span>
                        {(edu.startDate || edu.endDate) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '155px', flexShrink: 0 }}>
            {data?.skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionTitle color={color} variant="underline">Compétences</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.skills?.map((skill, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                      <SkillDots level={skill.level} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.languages?.length > 0 && (
              <div>
                <SectionTitle color={color} variant="underline">Langues</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {data?.languages?.map((lang, index) => (
                    <div key={index}>
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
const CompactTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <PhotoDisplay url={data.photoUrl} size="md" rounded="lg" border={`3px solid ${color}20`} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{data.fullName || "Votre Nom"}</h1>
          <p style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '2px' }}>{data.jobTitle || "Votre Titre"}</p>
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
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">Expérience</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data?.experiences?.map((exp, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</p>
                      </div>
                      <p style={{ fontSize: '10px', color: '#64748b' }}>{exp.company}</p>
                      {exp.description && <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.5 }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.education?.length > 0 && (
            <div>
              <SectionTitle color={color} variant="line">Formation</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data?.education?.map((edu, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</p>
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
          {data?.skills?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">Compétences</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data?.skills?.map((skill, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#475569', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                    <SkillDots level={skill.level} color={color} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.languages?.length > 0 && (
            <div>
              <SectionTitle color={color} variant="line">Langues</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data?.languages?.map((lang, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
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
const ExecutiveTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', backgroundColor: '#fafbfc' }}>
      <div style={{ padding: '32px 36px 24px', backgroundColor: '#1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{data?.fullName || "Votre Nom"}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{data?.jobTitle || "Votre Titre"}</p>
          </div>
          <PhotoDisplay url={data?.photoUrl} size="md" rounded="lg" border={`3px solid ${color}`} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${color}40` }}>
          {data?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconMail size={11} color={color} />{data.email}</span>}
          {data?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconPhone size={11} color={color} />{data?.phone}</span>}
          {data?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}><IconPin size={11} color={color} />{data?.location}</span>}
        </div>
      </div>
      <div style={{ padding: '24px 36px 32px' }}>
        {data?.summary && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', backgroundColor: 'white', borderRadius: '8px', borderLeft: `3px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.7 }}>{data?.summary}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {data?.experiences?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Expérience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data?.experiences?.map((exp, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}</span>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                      {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.education?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Formation</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.education?.map((edu, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
                      </div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color }}>{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: '145px', flexShrink: 0 }}>
            {data?.skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Compétences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.skills?.map((skill, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569', maxWidth: '75px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{skill.name}</span>
                      <SkillDots level={skill.level} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.languages?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>Langues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data?.languages?.map((lang, index) => (
                    <div key={index}>
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
const SidebarTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  return (
    <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '1055px', boxSizing: 'border-box' }}>
      <div style={{ width: '190px', minHeight: '1055px', boxSizing: 'border-box', backgroundColor: '#f8fafc', borderRight: `2px solid ${color}20`, padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhotoDisplay url={data.photoUrl} size="lg" rounded="lg" border={`3px solid ${color}30`} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}>{data.fullName || "Votre Nom"}</h1>
          <p style={{ fontSize: '10px', fontWeight: 600, color, marginTop: '3px' }}>{data.jobTitle || "Votre Titre"}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconMail size={10} color={color} /><span style={{ wordBreak: 'break-all' }}>{data.email}</span></div>}
          {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPhone size={10} color={color} /><span>{data.phone}</span></div>}
          {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPin size={10} color={color} /><span>{data.location}</span></div>}
        </div>
        {data?.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>Compétences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data?.skills?.map((skill, index) => (
                <div key={index}>
                  <span style={{ fontSize: '10px', color: '#475569', display: 'block', marginBottom: '3px' }}>{skill.name}</span>
                  <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, backgroundColor: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {data?.languages?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>Langues</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {data?.languages?.map((lang, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569' }}>{lang.name}</span>
                  <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ width: '405px', boxSizing: 'border-box', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {data?.summary && (
          <div>
            <SectionTitle color={color} variant="filled">Profil</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data?.experiences?.length > 0 && (
          <div>
            <SectionTitle color={color} variant="filled">Expérience professionnelle</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.experiences?.map((exp, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{exp.startDate}{exp.startDate && exp.endDate ? ' – ' : ''}{exp.endDate}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color, marginTop: '1px' }}>{exp.company}</p>
                  {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {data?.education?.length > 0 && (
          <div>
            <SectionTitle color={color} variant="filled">Formation</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.education?.map((edu, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}</span>
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

// ─── Template Minimaliste (T1 — DM Serif style) ───────────────────────────────
const MinimalisteTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const parts = (data?.fullName || 'Votre Nom').split(' ');
  const first = parts[0];
  const last = parts.slice(1).join(' ');
  const avatar = data?.photoUrl ? (
    <img src={data.photoUrl} alt="" className="w-[72px] h-[72px] rounded-full object-cover shrink-0" style={{ border: `2px solid ${color}20` }} />
  ) : (
    <div className="w-[72px] h-[72px] rounded-full shrink-0 flex items-center justify-center text-xl font-semibold" style={{ background: `${color}18`, color }}>{initials(data?.fullName || '')}</div>
  );
  return (
    <div className="cv-preview" style={{ width: '595px', height: '842px', boxSizing: 'border-box', background: '#fafaf8', color: '#1c1c1c', fontFamily: 'system-ui, sans-serif', boxShadow: '0 40px 100px rgba(0,0,0,.55)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: 'auto 1fr' }}>
        <div style={{ padding: '52px 60px 38px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'center', borderBottom: '1px solid #e9e6df' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {avatar}
            <div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', lineHeight: 0.95, fontWeight: 400, color: '#1c1c1c', letterSpacing: '-0.02em' }}>{first}<br />{last}</h1>
              <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '10px', color }}>{data?.jobTitle || 'Votre Titre'}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {data?.location && <span style={{ fontSize: '12px', color: '#777' }}>{data.location}</span>}
            {data?.phone && <span style={{ fontSize: '12px', color: '#777' }}>{data.phone}</span>}
            {data?.email && <span style={{ fontSize: '12px', color: '#777' }}>{data.email}</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gridTemplateRows: '1fr', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '38px 48px', borderRight: '1px solid #e9e6df', background: '#fafaf8', overflow: 'auto' }}>
            {data?.summary && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>Profil</h2>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.78 }}>{data.summary}</p>
              </div>
            )}
            {data?.experiences?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>Expérience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {data.experiences.map((exp, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1c1c1c' }}>{exp.position}</span>
                        <span style={{ fontSize: '11px', color: '#bbb' }}>{dateRange(exp.startDate, exp.endDate)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '7px' }}>{exp.company}</div>
                      {exp.description && <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.72 }}>{exp.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.education?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>Formation</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#1c1c1c' }}>{edu.degree}</span>
                        <span style={{ fontSize: '11px', color: '#bbb' }}>{dateRange(edu.startDate, edu.endDate)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{edu.school}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '38px 30px', background: '#f4f1eb', overflow: 'auto' }}>
            {data?.skills?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #ddd8cf' }}>Compétences</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.skills.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#444' }}>{skill.name}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} style={{ width: '9px', height: '9px', borderRadius: '50%', border: `1.5px solid ${j <= skill.level ? color : '#ccc'}`, background: j <= skill.level ? color : 'transparent' }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.languages?.length > 0 && (
              <div>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #ddd8cf' }}>Langues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.languages.map((lang, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#444' }}>{lang.name}</span>
                      <span style={{ fontSize: '11px', color: '#aaa' }}>{lang.level}</span>
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

// ─── Template Playfair (T2 — Créatif barre + italique) ─────────────────────────
const PlayfairTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const parts = (data?.fullName || 'Votre Nom').split(' ');
  const first = parts[0];
  const last = parts.slice(1).join(' ');
  const avatar = data?.photoUrl ? (
    <img src={data.photoUrl} alt="" className="w-20 h-20 rounded-md object-cover shrink-0" />
  ) : (
    <div className="w-20 h-20 rounded-md shrink-0 flex items-center justify-center text-2xl font-bold" style={{ background: `${color}15`, color }}>{initials(data?.fullName || '')}</div>
  );
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', color: '#0d0d0d', fontFamily: 'system-ui, sans-serif', boxShadow: '0 40px 100px rgba(0,0,0,.55)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '5px', background: color }} />
      <div style={{ padding: '44px 52px 32px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '28px', alignItems: 'start' }}>
        {avatar}
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '50px', lineHeight: 0.9, fontWeight: 700, letterSpacing: '-0.03em' }}>{first} <em style={{ color }}>{last}</em></h1>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '12px', color }}>{data?.jobTitle || 'Votre Titre'}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end', paddingTop: '4px' }}>
          {data?.email && <div style={{ fontSize: '11px', color: '#888' }}>{data.email}</div>}
          {data?.phone && <div style={{ fontSize: '11px', color: '#888' }}>{data.phone}</div>}
          {data?.location && <div style={{ fontSize: '11px', color: '#888' }}>{data.location}</div>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
        <div style={{ padding: '0 52px 48px' }}>
          <div style={{ height: '1px', background: '#0d0d0d', marginBottom: '26px' }} />
          {data?.summary && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>Profil</h2>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.75 }}>{data.summary}</p>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>Expérience professionnelle</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.experiences.map((exp, i) => (
                  <div key={i} style={{ paddingLeft: '14px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: '6px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color }} />
                    <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.01em' }}>{exp.position}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', margin: '2px 0 6px' }}>{exp.company} · {dateRange(exp.startDate, exp.endDate)}</div>
                    {exp.description && <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.75 }}>{exp.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.education?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>Formation</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{edu.school} · {dateRange(edu.startDate, edu.endDate)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '0 32px 48px', borderLeft: '1px solid #f0f0f0' }}>
          <div style={{ height: '1px', background: '#0d0d0d', marginBottom: '26px' }} />
          {data?.skills?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>Compétences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {data.skills.map((skill, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{skill.name}</span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} style={{ width: '8px', height: '8px', borderRadius: '1px', background: j <= skill.level ? color : '#eee' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.languages?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>Langues</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{lang.name}</span>
                    <span style={{ fontSize: '10px', color }}>{lang.level}</span>
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

// ─── Template Tech (T3 — Dark, monospace) ──────────────────────────────────────
const TechTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const slug = (data?.fullName || 'votre_nom').toLowerCase().replace(/\s+/g, '_');
  const parts = (data?.fullName || 'Votre Nom').split(' ');
  const first = parts[0];
  const last = parts.slice(1).join(' ');
  const avatar = data?.photoUrl ? (
    <img src={data.photoUrl} alt="" className="w-[60px] h-[60px] rounded-md object-cover" style={{ border: `1px solid ${color}40` }} />
  ) : (
    <div className="w-[60px] h-[60px] rounded-md flex items-center justify-center text-lg font-bold shrink-0" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>{initials(data?.fullName || '')}</div>
  );
  return (
    <div className="cv-preview" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', background: '#0e1117', color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', boxShadow: '0 40px 100px rgba(0,0,0,.75)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ background: '#161b22', padding: '11px 30px', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.2)', letterSpacing: '0.07em', marginLeft: '8px' }}>cv_{slug}.json</span>
      </div>
      <div style={{ padding: '40px 44px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.06em', marginBottom: '8px', color }}>$ cat ./profile.json</div>
          <h1 style={{ fontFamily: 'ui-monospace, monospace', fontSize: '38px', fontWeight: 700, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>{first}<br /><span style={{ color }}>{last}_</span></h1>
          <div style={{ fontSize: '11px', color: '#6b7a8d', marginTop: '9px', letterSpacing: '0.08em' }}>// {data?.jobTitle || 'Votre Titre'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '14px' }}>
            {data?.skills?.slice(0, 5).map((skill, i) => (
              <span key={i} style={{ fontSize: '9px', padding: '3px 9px', borderRadius: '3px', border: `1px solid ${color}40`, color, background: `${color}10` }}>{skill.name}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {avatar}
          <div style={{ fontSize: '9px', color: '#3a4556', textAlign: 'right', lineHeight: 2 }}>{data?.email}<br />{data?.phone}<br />{data?.location}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px' }}>
        <div style={{ padding: '32px 44px', borderRight: '1px solid rgba(255,255,255,.05)' }}>
          {data?.summary && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>Profil</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <p style={{ fontSize: '11px', color: '#5a6a7e', lineHeight: 1.8, fontFamily: 'system-ui, sans-serif' }}>{data.summary}</p>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>Expérience</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {data.experiences.map((exp, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{exp.position}</span>
                      <span style={{ fontSize: '9px', color }}>{dateRange(exp.startDate, exp.endDate)}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#3a4556', margin: '3px 0 7px' }}>{exp.company}</div>
                    {exp.description && <div style={{ fontSize: '10px', color: '#5a6a7e', lineHeight: 1.8, fontFamily: 'system-ui, sans-serif' }}>{exp.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.education?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>Formation</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#c0cfe0' }}>{edu.degree}</div>
                    <div style={{ fontSize: '9px', color: '#3a4556', marginTop: '3px' }}>{edu.school} · {dateRange(edu.startDate, edu.endDate)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '32px 28px' }}>
          {data?.skills?.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>Skills</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#8892a4' }}>{skill.name}</span>
                      <span style={{ fontSize: '9px', color }}>{skill.level}/5</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(skill.level / 5) * 100}%`, background: color, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.languages?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>Langues</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', color: '#8892a4' }}>{lang.name}</span>
                    <span style={{ fontSize: '9px', color }}>{lang.level}</span>
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

// ─── Router ───────────────────────────────────────────────────────────────────
const CVPreview = ({ data, forPdf = false }: CVPreviewProps) => {
  switch (data?.template) {
    case 'modern': return <ModernTemplate data={data} forPdf={forPdf} />;
    case 'creative': return <CreativeTemplate data={data} forPdf={forPdf} />;
    case 'compact': return <CompactTemplate data={data} forPdf={forPdf} />;
    case 'executive': return <ExecutiveTemplate data={data} forPdf={forPdf} />;
    case 'sidebar': return <SidebarTemplate data={data} forPdf={forPdf} />;
    case 'minimaliste': return <MinimalisteTemplate data={data} forPdf={forPdf} />;
    case 'playfair': return <PlayfairTemplate data={data} forPdf={forPdf} />;
    case 'tech': return <TechTemplate data={data} forPdf={forPdf} />;
    default: return <ClassicTemplate data={data} forPdf={forPdf} />;
  }
};

export default CVPreview;
