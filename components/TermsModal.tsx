"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, AlertCircle, Shield, Ban, X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'fr';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, language }) => {
  const content = {
    en: {
      title: "Terms of Use",
      subtitle: "Please read our terms carefully",
      sections: [
        {
          icon: FileText,
          title: "Service Usage",
          items: [
            "Free service for temporary email needs",
            "Use dropmail for legitimate purposes only",
            "No warranties or guarantees provided"
          ]
        },
        {
          icon: Ban,
          title: "Prohibited Activities",
          items: [
            "Do not use for illegal activities",
            "Do not use for spamming or harassment",
            "Do not use for fraudulent purposes"
          ]
        },
        {
          icon: Shield,
          title: "Account Management",
          items: [
            "We may block abusive usage patterns",
            "No email recovery after deletion",
            "Service availability is not guaranteed"
          ]
        },
        {
          icon: AlertCircle,
          title: "Limitations",
          items: [
            "Emails auto-delete after expiration",
            "No permanent storage of emails",
            "Rate limits may apply during high traffic"
          ]
        }
      ]
    },
    fr: {
      title: "Conditions d'Utilisation",
      subtitle: "Veuillez lire nos conditions attentivement",
      sections: [
        {
          icon: FileText,
          title: "Utilisation du Service",
          items: [
            "Service gratuit pour emails temporaires",
            "Utilisez dropmail à des fins légitimes uniquement",
            "Aucune garantie fournie"
          ]
        },
        {
          icon: Ban,
          title: "Activités Interdites",
          items: [
            "Interdit pour activités illégales",
            "Interdit pour spam ou harcèlement",
            "Interdit pour activités frauduleuses"
          ]
        },
        {
          icon: Shield,
          title: "Gestion des Comptes",
          items: [
            "Blocage possible en cas d'abus",
            "Aucune récupération après suppression",
            "La disponibilité du service n'est pas garantie"
          ]
        },
        {
          icon: AlertCircle,
          title: "Limitations",
          items: [
            "Les emails se suppriment automatiquement après expiration",
            "Aucun stockage permanent des emails",
            "Des limites de taux peuvent s'appliquer en cas de trafic élevé"
          ]
        }
      ]
    }
  };

  const t = content[language];
  const [mounted, setMounted] = React.useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with stronger blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            style={{ backdropFilter: 'blur(8px)' }}
          />
          
          {/* Modal - Perfectly Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 pointer-events-none"
          >
            <div 
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ff1616] to-[#faa61a] p-4 sm:p-5 md:p-6 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-5 md:right-5 lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <div className="pr-8 lg:pr-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  {t.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 border border-gray-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-[#ff1616] to-[#faa61a] flex items-center justify-center flex-shrink-0">
                          <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-black">{section.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff1616] to-[#faa61a] mt-1.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

