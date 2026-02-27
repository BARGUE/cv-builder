import { useRef } from "react";
import { useInView } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export function useInViewRef(margin: string = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: margin as any });
  return { ref, inView };
}
