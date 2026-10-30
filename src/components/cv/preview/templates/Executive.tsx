import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, SkillDots, PhotoDisplay } from "../shared";

// ─── Template Executive (premium, noir & couleur) ────────────────────────────
export const ExecutiveTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  return (
    <div className="cv-preview" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box', backgroundColor: '#fafbfc' }}>
      <div style={{ padding: '32px 36px 24px', backgroundColor: '#1a1a2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1 }}>{data?.fullName || L.yourName}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{data?.jobTitle || L.yourTitle}</p>
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
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>{L.experience}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data?.experiences?.map((exp, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(exp.startDate, exp.endDate)}</span>
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
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>{L.education}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.education?.map((edu, index) => (
                    <div key={index} style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(edu.startDate, edu.endDate)}</span>
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
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>{L.skills}</h2>
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
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a2e', paddingBottom: '6px', borderBottom: `2px solid ${color}`, marginBottom: '12px' }}>{L.languages}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data?.languages?.map((lang, index) => (
                    <div key={index}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: '#334155' }}>{lang.name}</p>
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
