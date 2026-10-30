import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, SkillDots, PhotoDisplay, SectionTitle } from "../shared";

// ─── Template Créatif (header dégradé) ───────────────────────────────────────
export const CreativeTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 32px', background: `linear-gradient(135deg, ${color}, ${color}cc, ${color}88)`, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <PhotoDisplay url={data.photoUrl} size="lg" border="3px solid rgba(255,255,255,0.4)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{data.fullName || L.yourName}</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: '2px' }}>{data.jobTitle || L.yourTitle}</p>
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
                <SectionTitle color={color} variant="underline">{L.experience}</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data?.experiences?.map((exp, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color }}>{exp.company}</span>
                        {(exp.startDate || exp.endDate) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {L.dateRange(exp.startDate, exp.endDate)}</span>}
                      </div>
                      {exp.description && <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', lineHeight: 1.6 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data?.education?.length > 0 && (
              <div>
                <SectionTitle color={color} variant="underline">{L.education}</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.education.map((edu, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>{edu.school}</span>
                        {(edu.startDate || edu.endDate) && <span style={{ fontSize: '9px', color: '#94a3b8' }}>· {L.dateRange(edu.startDate, edu.endDate)}</span>}
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
                <SectionTitle color={color} variant="underline">{L.skills}</SectionTitle>
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
                <SectionTitle color={color} variant="underline">{L.languages}</SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {data?.languages?.map((lang, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>{lang.name}</p>
                      <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '1px' }}>{L.level(lang.level)}</p>
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
