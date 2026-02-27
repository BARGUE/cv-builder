import type { CVData } from "@/src/types/cv";

function esc(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Génère le HTML du CV pour le rendu PDF (Playwright), sans React. */
export function buildCvPrintHtml(data: CVData): string {
    const color = data.accent_color || "#4F46E5";
    const pageStyle = `width:595px;min-height:842px;box-sizing:border-box;padding:32px;background:#fff;border-top:4px solid ${color};font-family:Inter,sans-serif;font-size:12px`;
    const titleStyle = "font-size:24px;font-weight:700;color:#111827";
    const headingStyle = `font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding-bottom:4px;margin-bottom:8px;border-bottom:1px solid ${color};color:${color}`;
    const subStyle = "font-size:11px;color:#6b7280";
    const boldStyle = "font-weight:600;color:#111827";

    const fullName = esc(data.full_name || "Votre Nom");
    const jobTitle = esc(data.job_title || "Votre Titre");
    const photo = data.photo_url
        ? `<img src="${esc(data.photo_url)}" alt="" style="width:96px;height:96px;border-radius:9999px;object-fit:cover" />`
        : '<div style="width:96px;height:96px;border-radius:9999px;background:#e5e7eb;display:flex;align-items:center;justify-content:center">👤</div>';

    let html = `<div style="${pageStyle}"><div style="text-align:center;margin-top:32px">${photo}<h1 style="${titleStyle}">${fullName}</h1><p style="${subStyle};font-size:14px;color:${color}">${jobTitle}</p><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;font-size:12px;color:#6b7280">`;
    if (data.email) html += `<span>${esc(data.email)}</span>`;
    if (data.phone) html += `<span>${esc(data.phone)}</span>`;
    if (data.location) html += `<span>${esc(data.location)}</span>`;
    html += "</div></div>";

    if (data.summary) {
        html += `<div style="margin-top:80px"><h2 style="${headingStyle}">Profil</h2><p style="${subStyle};line-height:1.5">${esc(data.summary)}</p></div>`;
    }

    if (data.experiences.length > 0) {
        html += `<div style="margin-top:80px"><h2 style="${headingStyle}">Expérience</h2><div style="margin-top:48px">`;
        for (const exp of data.experiences) {
            const dates = exp.start_date + (exp.start_date && exp.end_date ? " — " : "") + exp.end_date;
            html += `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div style="min-width:0"><p style="${boldStyle}">${esc(exp.position)}</p><p style="${subStyle}">${esc(exp.company)}</p></div><span style="font-size:10px;color:#9ca3af;flex-shrink:0">${esc(dates)}</span></div>`;
            if (exp.description) html += `<p style="${subStyle};font-size:11px;margin-top:4px">${esc(exp.description)}</p>`;
            html += "</div>";
        }
        html += "</div></div>";
    }

    if (data.education.length > 0) {
        html += `<div style="margin-top:80px"><h2 style="${headingStyle}">Formation</h2><div style="margin-top:32px">`;
        for (const edu of data.education) {
            const dates = edu.start_date + (edu.start_date && edu.end_date ? " — " : "") + edu.end_date;
            html += `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-top:8px"><div style="min-width:0"><p style="${boldStyle}">${esc(edu.degree)}</p><p style="${subStyle}">${esc(edu.school)}</p></div><span style="font-size:10px;color:#9ca3af;flex-shrink:0">${esc(dates)}</span></div>`;
        }
        html += "</div></div>";
    }

    if (data.skills.length > 0) {
        html += `<div style="margin-top:80px"><h2 style="${headingStyle}">Compétences</h2><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:12px;row-gap:6px">`;
        for (const skill of data.skills) {
            html += `<div style="${subStyle}">${esc(skill.name)}</div>`;
        }
        html += "</div></div>";
    }

    if (data.languages.length > 0) {
        html += `<div style="margin-top:80px"><h2 style="${headingStyle}">Langues</h2><div style="display:flex;flex-wrap:wrap;gap:4px 16px">`;
        for (const lang of data.languages) {
            html += `<span style="${subStyle}">${esc(lang.name)} — ${esc(lang.level)}</span>`;
        }
        html += "</div></div>";
    }

    html += "</div>";
    return html;
}
