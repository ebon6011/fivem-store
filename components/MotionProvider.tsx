"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// "user" = follow the visitor's reduce-motion setting.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
