import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, SkillDots, PhotoDisplay, SectionTitle } from "../shared";

// ─── Template Compact (minimaliste, timeline) ─────────────────────────────────
export const CompactTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  return (
    <div className="cv-preview bg-white" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 36px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <PhotoDisplay url={data.photoUrl} size="md" rounded="lg" border={`3px solid ${color}20`} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em' }}>{data.fullName || L.yourName}</h1>
          <p style={{ fontSize: '12px', fontWeight: 600, color, marginTop: '2px' }}>{data.jobTitle || L.yourTitle}</p>
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
              <SectionTitle color={color} variant="line">{L.about}</SectionTitle>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionTitle color={color} variant="line">{L.experience}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data?.experiences?.map((exp, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(exp.startDate, exp.endDate)}</p>
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
              <SectionTitle color={color} variant="line">{L.education}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data?.education?.map((edu, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '3px', borderRadius: '2px', backgroundColor: color, flexShrink: 0, marginTop: '2px', minHeight: '14px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                        <p style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(edu.startDate, edu.endDate)}</p>
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
              <SectionTitle color={color} variant="line">{L.skills}</SectionTitle>
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
              <SectionTitle color={color} variant="line">{L.languages}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data?.languages?.map((lang, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#475569' }}>{lang.name}</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.level(lang.level)}</span>
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
