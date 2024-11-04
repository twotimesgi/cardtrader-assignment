"use client"

import { MotionGlobalConfig } from "framer-motion"

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    MotionGlobalConfig.skipAnimations = true;
  }

export const FramerGlobalConfig = () => {
    return <></>;
};