import type { CVPreviewProps } from "@/src/components/cv/types";
import { ac, initials, usePreviewLabels } from "../shared";

// ─── Template Minimaliste (T1 — DM Serif style) ───────────────────────────────
export const MinimalisteTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  const parts = (data?.fullName || L.yourName).split(' ');
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
              <p style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '10px', color }}>{data?.jobTitle || L.yourTitle}</p>
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
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>{L.profile}</h2>
                <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.78 }}>{data.summary}</p>
              </div>
            )}
            {data?.experiences?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>{L.experience}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {data.experiences.map((exp, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1c1c1c' }}>{exp.position}</span>
                        <span style={{ fontSize: '11px', color: '#bbb' }}>{L.dateRange(exp.startDate, exp.endDate)}</span>
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
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e9e6df' }}>{L.education}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#1c1c1c' }}>{edu.degree}</span>
                        <span style={{ fontSize: '11px', color: '#bbb' }}>{L.dateRange(edu.startDate, edu.endDate)}</span>
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
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #ddd8cf' }}>{L.skills}</h2>
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
                <h2 style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #ddd8cf' }}>{L.languages}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.languages.map((lang, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#444' }}>{lang.name}</span>
                      <span style={{ fontSize: '11px', color: '#aaa' }}>{L.level(lang.level)}</span>
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
