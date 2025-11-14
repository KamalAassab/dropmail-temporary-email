"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FooterProps {
  language: 'en' | 'fr';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const content = {
    en: {
      made: "Made with",
      by: "by",
      rights: "All rights reserved.",
    },
    fr: {
      made: "Fait avec",
      by: "par",
      rights: "Tous droits réservés.",
    },
  };

  const t = content[language];

  return (
    <footer className="py-3 sm:py-4 px-3 sm:px-4 md:px-6 border-t border-gray-200/60 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity flex items-center">
              <img 
                src="/logo.png" 
                alt="dropmail" 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                style={{ maxWidth: 'min(140px, 30vw)' }}
              />
            </Link>
          </div>

          {/* Made with Love - Center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 text-xs sm:text-sm text-gray-600"
          >
            <span>{t.made}</span>
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#ff1616] text-[#ff1616]" />
            </motion.div>
            <span>{t.by} dropmail</span>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-xs sm:text-sm text-gray-600 flex-shrink-0"
          >
            <p className="text-center sm:text-right">
              © 2025. {t.rights}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
