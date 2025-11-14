"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 sm:mb-10 md:mb-12"
      >
        <div className="relative">
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 20px rgba(255,22,22,0.3))",
                "drop-shadow(0 0 40px rgba(250,166,26,0.6))",
                "drop-shadow(0 0 20px rgba(255,22,22,0.3))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64"
            style={{ maxWidth: 'min(240px, 60vw)', maxHeight: 'min(240px, 60vw)' }}
          >
            <img 
              src="/logo.png" 
              alt="dropmail" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-center px-2"
      >
        Instant emails. Zero trace.
      </motion.p>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-[#ff1616] to-[#faa61a] rounded-full shadow-lg"
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm"
      >
        {progress}%
      </motion.p>
    </motion.div>
  );
};

