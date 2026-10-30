import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, SkillDots, PhotoDisplay, SectionTitle } from "../shared";

// ─── Template Moderne (sidebar colorée) ───────────────────────────────────────
export const ModernTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
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
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>{L.skills}</h3>
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
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>{L.languages}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data?.languages?.map((lang, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)' }}>{lang.name}</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{L.level(lang.level)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ width: '395px', boxSizing: 'border-box', padding: '28px 24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{data?.fullName || L.yourName}</h1>
          <p style={{ fontSize: '13px', fontWeight: 600, color, marginTop: '4px', letterSpacing: '0.02em' }}>{data?.jobTitle || L.yourTitle}</p>
        </div>
        {data.summary && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">{L.profile}</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data?.experiences?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <SectionTitle color={color} variant="dot">{L.experience}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.experiences?.map((exp, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{exp.position}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px', whiteSpace: 'nowrap' }}>{L.dateRange(exp.startDate, exp.endDate)}</span>
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
            <SectionTitle color={color} variant="dot">{L.education}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.education?.map((edu, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0, padding: '2px 8px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>{L.dateRange(edu.startDate, edu.endDate)}</span>
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
