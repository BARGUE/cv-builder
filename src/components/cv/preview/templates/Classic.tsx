import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, SkillDots, PhotoDisplay, SectionTitle } from "../shared";

// ─── Template Classique ───────────────────────────────────────────────────────
export const ClassicTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ padding: '32px 36px 24px', borderBottom: `3px solid ${color}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <PhotoDisplay url={data?.photoUrl} size="lg" border={`3px solid ${color}30`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>{data?.fullName || L.yourName}</h1>
            <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data?.jobTitle || L.yourTitle}</p>
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
              <SectionTitle color={color} variant="filled">{L.profile}</SectionTitle>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data?.summary}</p>
            </div>
          )}

          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <SectionTitle color={color} variant="filled">{L.experience}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data?.experiences?.map((exp, index) => (
                  <div key={index} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>{L.dateRange(exp.startDate, exp.endDate)}</p>
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
              <SectionTitle color={color} variant="filled">{L.education}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data?.education?.map((edu, index) => (
                  <div key={index} style={{ paddingLeft: '12px', borderLeft: `2px solid ${color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(edu.startDate, edu.endDate)}</p>
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
              <SectionTitle color={color} variant="filled">{L.skills}</SectionTitle>
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
              <SectionTitle color={color} variant="filled">{L.languages}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
  );
};
