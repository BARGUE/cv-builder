"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

/**
 * Rend un nœud DOM en PDF A4. L'image garde ses proportions ;
 * si le contenu dépasse une page, il est réparti sur plusieurs pages.
 */
export async function generatePdfFromNode(node: HTMLElement, title = "CV"): Promise<void> {
  await document.fonts.ready;
  const imgData = await toPng(node, { backgroundColor: "#ffffff", pixelRatio: 2, cacheBust: true });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (node.offsetHeight * pageWidth) / node.offsetWidth;

  // Tolérance de 1 mm pour éviter une page blanche due aux arrondis.
  const pageCount = Math.max(1, Math.ceil((imgHeight - 1) / pageHeight));
  for (let page = 0; page < pageCount; page++) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -page * pageHeight, pageWidth, imgHeight);
  }

  pdf.save(`${title.replace(/[\\/:*?"<>|]/g, "-") || "CV"}.pdf`);
}
