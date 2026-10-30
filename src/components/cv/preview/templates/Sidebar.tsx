import type { CVPreviewProps } from "@/src/components/cv/types";
import { IconMail, IconPhone, IconPin, ac, usePreviewLabels, PhotoDisplay, SectionTitle } from "../shared";

// ─── Template Sidebar Gauche ─────────────────────────────────────────────────
export const SidebarTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  return (
    <div className="cv-preview bg-white flex" style={{ width: '595px', minHeight: '1055px', boxSizing: 'border-box' }}>
      <div style={{ width: '190px', minHeight: '1055px', boxSizing: 'border-box', backgroundColor: '#f8fafc', borderRight: `2px solid ${color}20`, padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PhotoDisplay url={data.photoUrl} size="lg" rounded="lg" border={`3px solid ${color}30`} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}>{data.fullName || L.yourName}</h1>
          <p style={{ fontSize: '10px', fontWeight: 600, color, marginTop: '3px' }}>{data.jobTitle || L.yourTitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconMail size={10} color={color} /><span style={{ wordBreak: 'break-all' }}>{data.email}</span></div>}
          {data.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPhone size={10} color={color} /><span>{data.phone}</span></div>}
          {data.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#64748b' }}><IconPin size={10} color={color} /><span>{data.location}</span></div>}
        </div>
        {data?.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>{L.skills}</h3>
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
            <h3 style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color, marginBottom: '8px' }}>{L.languages}</h3>
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
      <div style={{ width: '405px', boxSizing: 'border-box', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {data?.summary && (
          <div>
            <SectionTitle color={color} variant="filled">{L.profile}</SectionTitle>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.7 }}>{data.summary}</p>
          </div>
        )}
        {data?.experiences?.length > 0 && (
          <div>
            <SectionTitle color={color} variant="filled">{L.experienceFull}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.experiences?.map((exp, index) => (
                <div key={index}>
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
            <SectionTitle color={color} variant="filled">{L.education}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data?.education?.map((edu, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</p>
                    <span style={{ fontSize: '9px', color: '#94a3b8', flexShrink: 0 }}>{L.dateRange(edu.startDate, edu.endDate)}</span>
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
