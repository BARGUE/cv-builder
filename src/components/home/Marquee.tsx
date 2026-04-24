import { getTranslations } from "next-intl/server";

export async function Marquee() {
  const t = await getTranslations("marquee");
  const items = t.raw("items") as string[];

  return (
    <div className="relative overflow-hidden bg-background py-5 border-y border-border">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex w-max min-w-max shrink-0 animate-marquee">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-3 mx-6">
            <span className="text-primary text-xs">✦</span>
            <span className="text-sm font-semibold tracking-wide text-muted-foreground/60 uppercase">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}