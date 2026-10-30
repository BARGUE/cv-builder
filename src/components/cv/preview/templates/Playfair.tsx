import type { CVPreviewProps } from "@/src/components/cv/types";
import { ac, initials, usePreviewLabels } from "../shared";

// ─── Template Playfair (T2 — Créatif barre + italique) ─────────────────────────
export const PlayfairTemplate = ({ data }: CVPreviewProps) => {
  const color = ac(data);
  const L = usePreviewLabels();
  const parts = (data?.fullName || L.yourName).split(' ');
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
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '12px', color }}>{data?.jobTitle || L.yourTitle}</p>
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
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>{L.profile}</h2>
              <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.75 }}>{data.summary}</p>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>{L.experienceFull}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.experiences.map((exp, i) => (
                  <div key={i} style={{ paddingLeft: '14px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: '6px', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: color }} />
                    <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.01em' }}>{exp.position}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', margin: '2px 0 6px' }}>{exp.company} · {L.dateRange(exp.startDate, exp.endDate)}</div>
                    {exp.description && <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.75 }}>{exp.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.education?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>{L.education}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{edu.degree}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{edu.school} · {L.dateRange(edu.startDate, edu.endDate)}</div>
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
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>{L.skills}</h2>
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
              <h2 style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#ccc', marginBottom: '14px' }}>{L.languages}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{lang.name}</span>
                    <span style={{ fontSize: '10px', color }}>{L.level(lang.level)}</span>
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
