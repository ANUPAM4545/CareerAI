"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
      >
        <Mic className="w-8 h-8 text-white" />
      </motion.div>
    </div>
  );
}
