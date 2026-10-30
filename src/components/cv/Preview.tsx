"use client";

import type { ComponentType } from "react";
import type { CVTemplate } from "@/src/types/cv";
import type { CVPreviewProps } from "@/src/components/cv/types";
import { ClassicTemplate } from "./preview/templates/Classic";
import { ModernTemplate } from "./preview/templates/Modern";
import { CreativeTemplate } from "./preview/templates/Creative";
import { CompactTemplate } from "./preview/templates/Compact";
import { ExecutiveTemplate } from "./preview/templates/Executive";
import { SidebarTemplate } from "./preview/templates/Sidebar";
import { MinimalisteTemplate } from "./preview/templates/Minimaliste";
import { PlayfairTemplate } from "./preview/templates/Playfair";
import { TechTemplate } from "./preview/templates/Tech";

/** Un template par id : ajouter un id dans TEMPLATE_IDS sans l'enregistrer ici ne compile pas. */
const TEMPLATES: Record<CVTemplate, ComponentType<CVPreviewProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
  executive: ExecutiveTemplate,
  sidebar: SidebarTemplate,
  minimaliste: MinimalisteTemplate,
  playfair: PlayfairTemplate,
  tech: TechTemplate,
};

const CVPreview = ({ data, forPdf = false }: CVPreviewProps) => {
  const Template = TEMPLATES[data?.template] ?? ClassicTemplate;
  return <Template data={data} forPdf={forPdf} />;
};

export default CVPreview;
