"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import type { CVData } from "@/src/types/cv";
import type { DashboardDownloadPdfOptions } from "@/src/types/dashboard";

export async function generatePdfFromNode(
  node: HTMLElement | null,
  options?: { title?: string }
): Promise<void> {
  if (!node) return;
  await document.fonts.ready;
  const imgData = await toPng(node, {
    backgroundColor: "#ffffff",
    pixelRatio: 2,
    cacheBust: true,
  });
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  const fileName = options?.title ?? "CV";
  pdf.save(`${fileName}.pdf`);
}

export type { DashboardDownloadPdfOptions };

export async function dashboardDownloadPdf(
  e: { preventDefault(): void; stopPropagation(): void },
  options: DashboardDownloadPdfOptions
): Promise<void> {
  e.preventDefault();
  e.stopPropagation();
  const {
    cv,
    apiBaseUrl,
    getNode,
    isDownloading,
    onStart,
    onCvLoaded,
    onSuccess,
    onError,
    onFinish,
    renderDelayMs = 400,
  } = options;

  if (isDownloading) return;
  onStart();

  try {
    const res = await fetch(`${apiBaseUrl}/${cv.id}`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      onError("Impossible de charger le CV");
      onFinish();
      return;
    }

    const data = (await res.json()) as CVData;
    onCvLoaded(data);

    if (getNode) {
      setTimeout(() => {
        const el = getNode();
        if (el) {
          generatePdfFromNode(el, { title: data.title || "CV" })
            .then(onSuccess)
            .catch(() => onError("Erreur lors de la génération du PDF"))
            .finally(onFinish);
        } else {
          onFinish();
        }
      }, renderDelayMs);
    } else {
      onFinish();
    }
  } catch {
    onError("Erreur lors du chargement du CV");
    onFinish();
  }
}
