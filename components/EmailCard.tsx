"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Mail } from "lucide-react";
import { Button } from "./ui/button";

interface EmailCardProps {
  email: string;
  onCopy: () => void;
  language: 'en' | 'fr';
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onCopy, language }) => {
  const [copied, setCopied] = useState(false);

  const translations = {
    en: {
      yourTemporaryEmail: "Your Temporary Email",
    },
    fr: {
      yourTemporaryEmail: "Votre Email Temporaire",
    },
  };

  const t = translations[language];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg p-4 sm:p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex-shrink-0"
        >
          <div className="bg-gradient-to-br from-[#ff1616] to-[#faa61a] p-3 rounded-xl shadow-md">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            {t.yourTemporaryEmail}
          </p>
          <div className="flex items-center gap-2">
            <code className="text-sm sm:text-base font-bold text-gray-900 break-all word-break-break-all flex-1">
              {email}
            </code>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="flex-shrink-0 w-9 h-9 rounded-lg border-2 border-gray-200 hover:border-[#ff1616] hover:bg-[#ff1616]/5 transition-all"
              >
                {copied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </motion.div>
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
