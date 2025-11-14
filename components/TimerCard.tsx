"use client";

import React from "react";
import { motion } from "framer-motion";
import { RotateCw, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { formatTimer } from "@/lib/utils";

interface TimerCardProps {
  timeLeft: number;
  onExtend: () => void;
  onChangeEmail: () => void;
  onDeleteEmail: () => void;
  loading: boolean;
  language: 'en' | 'fr';
}

export const TimerCard: React.FC<TimerCardProps> = ({ 
  timeLeft, 
  onExtend, 
  onChangeEmail,
  onDeleteEmail,
  loading,
  language 
}) => {
  const percentage = (timeLeft / 600) * 100;
  const isLow = timeLeft < 120;
  const isCritical = timeLeft < 60;

  const translations = {
    en: {
      timeRemaining: "Time Remaining",
      warning: "Time is running out! Reset or generate a new email.",
      changeEmail: "Change Email",
      deleteEmail: "Delete Email",
    },
    fr: {
      timeRemaining: "Temps Restant",
      warning: "Le temps s'écoule! Réinitialisez ou générez un nouvel email.",
      changeEmail: "Changer l'Email",
      deleteEmail: "Supprimer l'Email",
    },
  };

  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg overflow-hidden backdrop-blur-sm"
    >
      <div className="p-4 sm:p-5">
        {/* Timer Section */}
        <div className="flex items-center gap-4 sm:gap-5 mb-4">
          {/* Timer Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {t.timeRemaining}
            </p>
            <div
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums ${
                isCritical
                  ? "text-[#ff1616]"
                  : isLow
                  ? "text-[#ff6b35]"
                  : "text-[#faa61a]"
              }`}
            >
              {formatTimer(timeLeft)}
            </div>
          </div>

          {/* Reset Button */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-shrink-0"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={onExtend}
              className={`w-10 h-10 rounded-xl border-2 transition-all ${
                isLow
                  ? "border-[#ff1616]/40 bg-[#ff1616]/5 hover:border-[#ff1616] hover:bg-[#ff1616]/10"
                  : "border-gray-200 hover:border-[#faa61a] hover:bg-[#faa61a]/5"
              }`}
            >
              <RotateCw className={`w-4 h-4 transition-colors ${
                isLow ? "text-[#ff1616]" : "text-gray-600"
              }`} strokeWidth={2.5} />
            </Button>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Change Email Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={onChangeEmail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ff1616] to-[#faa61a] hover:from-[#ff2a2a] hover:to-[#ffb833] text-white h-10 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all rounded-xl"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.changeEmail}</span>
                </span>
              )}
            </Button>
          </motion.div>

          {/* Delete Email Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button
              onClick={onDeleteEmail}
              disabled={loading}
              variant="outline"
              className="w-full border-2 border-[#ff1616] text-[#ff1616] hover:bg-[#ff1616] hover:text-white h-10 sm:h-11 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all rounded-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>{t.deleteEmail}</span>
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Warning Message */}
        {isLow && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border-2 ${
              isCritical
                ? "bg-red-50/80 text-red-700 border-red-200/50"
                : "bg-orange-50/80 text-orange-700 border-orange-200/50"
            } backdrop-blur-sm`}
          >
            <motion.div
              animate={isCritical ? {
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              } : {
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertCircle className={`w-4 h-4 ${
                isCritical ? "text-red-600" : "text-orange-600"
              }`} strokeWidth={2.5} />
            </motion.div>
            <span className="flex-1 truncate">{t.warning}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
