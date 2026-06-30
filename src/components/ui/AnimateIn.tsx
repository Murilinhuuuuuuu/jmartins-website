"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimateInProps extends HTMLMotionProps<"div"> {
  stagger?: boolean;
}

export function AnimateIn({
  children,
  className,
  stagger = false,
  ...props
}: AnimateInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger ? staggerContainer : fadeUp}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimateItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}
