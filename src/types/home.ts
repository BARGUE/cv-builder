import { type ComponentProps } from "react";
import { motion } from "framer-motion";

export type MotionDivProps = ComponentProps<typeof motion.div>;

export interface FloatingCardConfig {
  id: string;
  motion: {
    initial: MotionDivProps["initial"];
    animate: MotionDivProps["animate"];
    transition: MotionDivProps["transition"];
  };
  className: string;
  render: () => React.ReactNode;
}

export interface StepConfig {
  id: number;
  render: () => React.ReactNode;
}
