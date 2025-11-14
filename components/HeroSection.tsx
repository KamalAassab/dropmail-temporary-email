"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Clock } from "lucide-react";

interface HeroSectionProps {
  language: 'en' | 'fr';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language }) => {
  const content = {
    en: {
      instant: "Instant",
      emails: "emails.",
      zero: "Zero",
      trace: "trace.",
      subtitle: "Protect your real inbox from spam, newsletters, and unwanted emails. Generate temporary email addresses that self-destruct after use.",
      features: [
        { icon: Zap, title: "Instant Creation", desc: "Generate emails in seconds" },
        { icon: Shield, title: "Zero Trace", desc: "Complete privacy guaranteed" },
        { icon: Clock, title: "Auto-Delete", desc: "Self-destruct after 10 minutes" },
      ],
    },
    fr: {
      instant: "Emails",
      emails: "instantanés.",
      zero: "Zéro",
      trace: "trace.",
      subtitle: "Protégez votre boîte de réception réelle du spam, des newsletters et des emails indésirables. Générez des adresses email temporaires qui s'autodétruisent après utilisation.",
      features: [
        { icon: Zap, title: "Création Instantanée", desc: "Générez des emails en secondes" },
        { icon: Shield, title: "Zéro Trace", desc: "Confidentialité totale garantie" },
        { icon: Clock, title: "Suppression Auto", desc: "Autodestruction après 10 minutes" },
      ],
    },
  };

  const t = content[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4"
    >
      <div className="max-w-4xl mx-auto text-center px-2">
        {/* Main Heading - Responsive with proper wrapping */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
        >
          {language === 'fr' ? (
            <>
              <span className="text-black">{t.instant} </span>
              <span className="bg-gradient-to-r from-[#ff1616] to-[#faa61a] bg-clip-text text-transparent">
                {t.emails}
              </span>
              {' '}
              <span className="text-black">{t.zero} </span>
              <span className="bg-gradient-to-r from-[#ff1616] to-[#faa61a] bg-clip-text text-transparent">
                {t.trace}
              </span>
            </>
          ) : (
            <>
              <span className="text-black">{t.instant} </span>
              <span className="bg-gradient-to-r from-[#ff1616] to-[#faa61a] bg-clip-text text-transparent">
                {t.emails}
              </span>
              {' '}
              <span className="text-black">{t.zero} </span>
              <span className="bg-gradient-to-r from-[#ff1616] to-[#faa61a] bg-clip-text text-transparent">
                {t.trace}
              </span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-2"
        >
          {t.subtitle}
        </motion.p>

        {/* Feature Cards - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2"
        >
          {t.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-lg bg-gradient-to-r from-[#ff1616] to-[#faa61a] flex items-center justify-center">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-bold text-sm sm:text-base mb-0.5 text-black truncate">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
