"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CVPreview from "@/src/components/cv/Preview";
import { generatePdfFromNode } from "@/src/lib/pdf";
import type { CVData } from "@/src/types/cv";

/**
 * Rend le CV hors écran uniquement le temps de l'export, puis génère le PDF.
 * Utilisation : `const { exportPdf, exporting, pdfNode } = usePdfExport();` et placer `{pdfNode}` dans le JSX.
 */
export function usePdfExport() {
  const [data, setData] = useState<CVData | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const onRendered = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (data && onRendered.current) {
      onRendered.current();
      onRendered.current = null;
    }
  }, [data]);

  const exportPdf = useCallback(async (cv: CVData) => {
    const rendered = new Promise<void>((resolve) => {
      onRendered.current = resolve;
    });
    setData(cv);
    await rendered;
    try {
      if (!nodeRef.current) throw new Error("PDF node not mounted");
      await generatePdfFromNode(nodeRef.current, cv.title);
    } finally {
      setData(null);
    }
  }, []);

  const pdfNode = data ? (
    <div aria-hidden style={{ position: "fixed", left: "-9999px", top: 0, width: "595px" }}>
      <div ref={nodeRef} style={{ width: "595px", fontFamily: "Inter, sans-serif" }}>
        <CVPreview data={data} forPdf />
      </div>
    </div>
  ) : null;

  return { exportPdf, exporting: data !== null, pdfNode };
}
