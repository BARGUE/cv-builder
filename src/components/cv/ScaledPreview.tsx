"use client";

import { useEffect, useRef, useState } from "react";
import CVPreview from "@/src/components/cv/Preview";
import type { CVData } from "@/src/types/cv";
import { cn } from "@/src/lib/utils";

const CV_WIDTH = 595;
const CV_HEIGHT = 842;

/** Aperçu A4 réduit pour remplir la largeur de son conteneur, en conservant le ratio. */
export function ScaledPreview({ data, className }: { data: CVData; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / CV_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden bg-white", className)}
      style={{ aspectRatio: `${CV_WIDTH} / ${CV_HEIGHT}` }}
    >
      {scale > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: CV_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <CVPreview data={data} />
        </div>
      )}
    </div>
  );
}
