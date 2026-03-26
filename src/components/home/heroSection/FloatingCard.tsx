import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingCardConfig } from "@/src/types/home";

const SkeletonLine = ({ width = "full" }: { width?: string }) => (
  <div className={`h-1 w-${width} rounded-full bg-gray-100`} />
);

const SectionBlock = ({ title, lines }: { title: string; lines: string[] }) => (
  <div>
    <div className="text-[8px] font-semibold text-[hsl(238,66%,55%)] mb-1">{title}</div>
    <div className="space-y-0.5">
      {lines.map((w, i) => <SkeletonLine key={i} width={w} />)}
    </div>
  </div>
);

const Checkmark = () => (
  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const FLOATING_CARDS: FloatingCardConfig[] = [
  {
    id: "cv",
    motion: {
      initial: { opacity: 0, x: 30, y: 10 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0.6, delay: 0.5 },
    },
    className: "absolute -right-4 top-8 md:right-0 md:top-12 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20",
    render: () => (
      <>
        <div className="bg-[hsl(238,66%,55%)] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">EM</div>
            <div>
              <div className="text-[10px] font-semibold text-white">Elsa Monet</div>
              <div className="text-[8px] text-white/60">Conseillère de vente</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 space-y-2">
          <SectionBlock title="Expérience professionnelle" lines={["full", "4/5", "3/5"]} />
          <div className="h-px bg-gray-100" />
          <SectionBlock title="Diplômes et formations" lines={["full", "5/6"]} />
        </div>
      </>
    ),
  },
  {
    id: "palette",
    motion: {
      initial: { opacity: 0, x: -20, y: 20 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0.5, delay: 0.7 },
    },
    className: "absolute left-0 bottom-1/3 md:left-4 md:bottom-1/3 bg-white rounded-lg shadow-xl border border-gray-100 px-3 py-2.5 z-20",
    render: () => (
      <>
        <div className="text-[9px] font-medium text-gray-500 mb-1.5">Compétences</div>
        <div className="flex gap-1.5 mb-2">
          {["#4f46e5","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"].map((c) => (
            <div key={c} className="w-4 h-4 rounded-md cursor-pointer" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-gray-400">
          <span className="font-medium">B</span>
          <span className="italic">I</span>
          <span className="underline">U</span>
          <span>S</span>
        </div>
      </>
    ),
  },
  {
    id: "download",
    motion: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: 0.9 },
    },
    className: "absolute bottom-8 right-4 md:bottom-12 md:right-8 bg-white rounded-lg shadow-xl border border-gray-100 px-4 py-2.5 z-20 flex items-center gap-2",
    render: () => (
      <>
        <Download className="h-3.5 w-3.5 text-[hsl(238,66%,55%)]" />
        <span className="text-xs font-medium text-gray-700">Importer mon CV</span>
      </>
    ),
  },
  {
    id: "content",
    motion: {
      initial: { opacity: 0, x: 20, y: -20 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { duration: 0.5, delay: 0.8 },
    },
    className: "absolute top-2 right-12 md:top-4 md:right-16 bg-white rounded-lg shadow-xl border border-gray-100 px-3 py-2 z-30",
    render: () => (
      <>
        <div className="text-[9px] font-semibold text-gray-700 mb-1">Contenu pré-rédigé</div>
        <div className="flex items-center gap-1.5">
          <Checkmark />
          <div className="h-2 w-16 rounded-full bg-emerald-100" />
        </div>
      </>
    ),
  },
];

export function FloatingCard({ id }: { id: string }) {
  const card = FLOATING_CARDS.find((c) => c.id === id);
  if (!card) return null;

  return (
    <motion.div
      initial={card.motion.initial}
      animate={card.motion.animate}
      transition={card.motion.transition}
      className={card.className}
    >
      {card.render()}
    </motion.div>
  );
}