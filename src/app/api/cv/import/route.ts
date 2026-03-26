import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CVData, defaultImportCVData } from "@/src/types/cv";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { base64, mimeType } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{
      role: "user",
      content: [
        {
          type: "document",
          source: { type: "base64", media_type: mimeType, data: base64 },
        },
        {
          type: "text",
          text: `Extrais les informations de ce CV. 
          Retourne UNIQUEMENT un JSON valide sans markdown ni backticks, 
          en suivant exactement cette structure :
          ${JSON.stringify(defaultImportCVData, null, 2)}
          
          Règles :
          - Ne jamais inventer d'informations absentes du CV
          - Mettre null pour les champs non trouvés
          - Les dates au format "MM/YYYY" si possible`,
        },
      ],
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cvData: CVData = JSON.parse(text);

  return NextResponse.json(cvData);
}