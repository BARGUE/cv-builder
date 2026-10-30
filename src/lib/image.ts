"use client";

const MAX_INPUT_SIZE = 10 * 1024 * 1024;

/**
 * Charge une image et la redimensionne (côté le plus long ≤ maxSize) en data URL JPEG.
 * Évite d'envoyer au backend des photos de plusieurs Mo encodées en base64.
 */
export async function resizeImageToDataUrl(file: File, maxSize = 400, quality = 0.85): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("not-an-image");
  if (file.size > MAX_INPUT_SIZE) throw new Error("too-large");

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-unavailable");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}
