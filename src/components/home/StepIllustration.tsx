import { StepConfig } from "@/src/types/home";
import { LayoutGrid, Zap, Download } from "lucide-react";

const MockupCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md border border-[hsl(238,50%,90%)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const Line = ({ width = "full", opacity = 20 }: { width?: string; opacity?: number }) => (
  <div className={`h-0.5 w-${width} rounded-full bg-[hsl(238,66%,55%)]/${opacity}`} />
);

const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`absolute shadow-lg z-20 ${className}`}>{children}</div>
);

const STEPS: StepConfig[] = [
  {
    id: 1,
    render: () => (
      <>
        <MockupCard className="w-24 relative z-10">
          <div className="h-2 bg-[hsl(238,66%,55%)]" />
          <div className="p-2 space-y-1.5">
            <div className="h-1 w-10 rounded-full bg-[hsl(238,66%,55%)]/30" />
            <div className="h-0.5 w-full rounded-full bg-gray-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-gray-200" />
            <div className="h-px bg-gray-100 my-1" />
            <div className="h-0.5 w-full rounded-full bg-gray-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-gray-200" />
            <div className="h-0.5 w-2/3 rounded-full bg-gray-200" />
          </div>
        </MockupCard>
        <Badge className="top-3 left-6 w-8 h-8 rounded-lg bg-[hsl(238,66%,55%)] flex items-center justify-center">
          <LayoutGrid className="h-3.5 w-3.5 text-white" />
        </Badge>
      </>
    ),
  },
  {
    id: 2,
    render: () => (
      <>
        <MockupCard className="w-32">
          <div className="border-b border-gray-100 px-2 py-1.5 flex items-center gap-1">
            {["bg-red-300", "bg-yellow-300", "bg-green-300"].map((c) => (
              <div key={c} className={`w-1 h-1 rounded-full ${c}`} />
            ))}
          </div>
          <div className="p-2 space-y-1.5">
            {["full", "full", "3/4", "full", "5/6"].map((w, i) => (
              i === 3
                ? <div key={i} className="h-3 w-full rounded bg-[hsl(238,66%,55%)]/5 mt-1" />
                : <Line key={i} width={w} />
            ))}
          </div>
        </MockupCard>
        <Badge className="top-2 right-8 bg-white rounded-full border border-[hsl(238,50%,90%)] px-2.5 py-1 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-[hsl(238,66%,55%)]" />
          <span className="text-[9px] font-semibold text-gray-700">Aperçu live</span>
        </Badge>
      </>
    ),
  },
  {
    id: 3,
    render: () => (
      <div className="space-y-2">
        <MockupCard className="flex gap-1 p-1">
          {["XS", "S", "M", "L"].map((s, i) => (
            <div key={s} className={`px-2 py-1 rounded text-[9px] font-bold ${i === 2 ? "bg-[hsl(238,66%,55%)] text-white" : "text-gray-400"}`}>
              {s}
            </div>
          ))}
        </MockupCard>
        <MockupCard className="flex gap-1 p-1.5">
          {["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#6366f1","#8b5cf6","#ec4899"].map((c) => (
            <div key={c} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </MockupCard>
        <MockupCard className="flex gap-1 p-1.5">
          {["B", "I", "U"].map((f) => (
            <div key={f} className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-[hsl(238,66%,55%)] bg-[hsl(238,66%,55%)]/10">
              {f}
            </div>
          ))}
        </MockupCard>
      </div>
    ),
  },
  {
    id: 4,
    render: () => (
      <>
        <MockupCard className="w-24">
          <div className="p-2 space-y-1">
            <div className="h-1 w-8 rounded-full bg-[hsl(238,66%,55%)]/30" />
            {["full", "4/5", "full", "3/4"].map((w, i) => (
              i === 2
                ? <div key={i} className="h-px bg-gray-100" />
                : <div key={i} className={`h-0.5 w-${w} rounded-full bg-gray-200`} />
            ))}
          </div>
        </MockupCard>
        <Badge className="top-2 right-6 w-8 h-8 rounded-lg bg-[hsl(235,40%,14%)] flex items-center justify-center">
          <Download className="h-3.5 w-3.5 text-white" />
        </Badge>
        <Badge className="bottom-6 left-8 bg-white rounded-md border border-[hsl(238,50%,90%)] px-2 py-1 flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-gray-500">PDF</span>
          <div className="h-1.5 w-10 rounded-full bg-emerald-400" />
          <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </Badge>
      </>
    ),
  },
];

export function StepIllustration({ id }: { id: number }) {
  const step = STEPS.find((s) => s.id === id);
  if (!step) return null;

  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      {step.render()}
    </div>
  );
}