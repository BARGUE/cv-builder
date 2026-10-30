import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import mammoth from "mammoth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "@/src/lib/auth";
import { LANGUAGE_LEVELS, normalizeCVData } from "@/src/types/cv";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const PDF = "application/pdf";
const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const client = new Anthropic();

/** Schéma demandé au modèle : uniquement les champs extractibles d'un CV. */
const extractedCvSchema = z.object({
  fullName: z.string(),
  jobTitle: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  summary: z.string(),
  experiences: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    }),
  ),
  skills: z.array(z.object({ name: z.string(), level: z.number().int() })),
  languages: z.array(z.object({ name: z.string(), level: z.enum(LANGUAGE_LEVELS) })),
});

const INSTRUCTIONS = `Extrais les informations du CV fourni pour pré-remplir un éditeur de CV.

Règles :
- N'invente jamais d'information absente du CV : utilise une chaîne vide (ou une liste vide) si elle n'y figure pas.
- Dates au format "MM/YYYY" ; si seule l'année est connue, "01/YYYY". Pour un poste en cours, laisse endDate vide.
- Niveau de compétence : entier de 1 (notions) à 5 (expert), estimé d'après le contexte ; 3 par défaut.
- Conserve la langue d'origine du CV pour les textes.`;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function buildDocumentBlock(file: File): Promise<Anthropic.ContentBlockParam> {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (file.type === PDF) {
    return { type: "document", source: { type: "base64", media_type: PDF, data: buffer.toString("base64") } };
  }
  const { value } = await mammoth.extractRawText({ buffer });
  return { type: "document", source: { type: "text", media_type: "text/plain", data: value } };
}

export async function POST(req: NextRequest) {
  if (!(await getToken())) return error("Non authentifié", 401);

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) return error("Fichier manquant", 400);
  if (file.size > MAX_FILE_SIZE) return error("Fichier trop volumineux", 413);
  if (file.type !== PDF && file.type !== DOCX) return error("Format non pris en charge", 415);

  try {
    const document = await buildDocumentBlock(file);
    const response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low", format: zodOutputFormat(extractedCvSchema) },
      messages: [{ role: "user", content: [document, { type: "text", text: INSTRUCTIONS }] }],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return error("Impossible d'analyser ce CV", 422);
    }

    const cv = normalizeCVData({ ...response.parsed_output, currentStep: 7, completed: false });
    return NextResponse.json(cv);
  } catch (err) {
    console.error("CV import failed:", err);
    return error("Service d'analyse indisponible", 502);
  }
}
