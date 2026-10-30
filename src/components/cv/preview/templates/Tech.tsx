import type { CVPreviewProps } from "@/src/components/cv/types";
import { ac, initials, usePreviewLabels } from "../shared";

// ─── Template Tech (T3 — Dark, monospace) ──────────────────────────────────────
export const TechTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  const slug = (data?.fullName || 'votre_nom').toLowerCase().replace(/\s+/g, '_');
  const parts = (data?.fullName || L.yourName).split(' ');
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
          <div style={{ fontSize: '11px', color: '#6b7a8d', marginTop: '9px', letterSpacing: '0.08em' }}>{"// "}{data?.jobTitle || L.yourTitle}</div>
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
                <span>{L.profile}</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <p style={{ fontSize: '11px', color: '#5a6a7e', lineHeight: 1.8, fontFamily: 'system-ui, sans-serif' }}>{data.summary}</p>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color }}>
                <span>{L.experience}</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {data.experiences.map((exp, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{exp.position}</span>
                      <span style={{ fontSize: '9px', color }}>{L.dateRange(exp.startDate, exp.endDate)}</span>
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
                <span>{L.education}</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#c0cfe0' }}>{edu.degree}</div>
                    <div style={{ fontSize: '9px', color: '#3a4556', marginTop: '3px' }}>{edu.school} · {L.dateRange(edu.startDate, edu.endDate)}</div>
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
                <span>{L.languages}</span><span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,.06)' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '10px', color: '#8892a4' }}>{lang.name}</span>
                    <span style={{ fontSize: '9px', color }}>{L.level(lang.level)}</span>
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
