"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, Lock, Clock, X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'fr';
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, language }) => {
  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "Your privacy is our priority",
      policies: [
        {
          icon: Shield,
          title: "No Data Collection",
          desc: "We don't collect, store, or track any personal information. Your temporary emails are truly anonymous."
        },
        {
          icon: Eye,
          title: "No Registration Required",
          desc: "Use dropmail instantly without creating an account. No email, no password, no personal details needed."
        },
        {
          icon: Clock,
          title: "Auto-Delete",
          desc: "All temporary emails automatically delete after 10 minutes. Extend if needed, but they never stay forever."
        },
        {
          icon: Lock,
          title: "Secure & Private",
          desc: "Your emails are encrypted and accessible only during the active session. No logs, no history, no traces."
        }
      ],
      details: {
        title: "Privacy Details",
        items: [
          "Zero personal data collection",
          "Anonymous email generation",
          "No cookies or tracking",
          "No email content storage",
          "No IP logging or tracking"
        ]
      }
    },
    fr: {
      title: "Politique de Confidentialité",
      subtitle: "Votre confidentialité est notre priorité",
      policies: [
        {
          icon: Shield,
          title: "Aucune Collecte de Données",
          desc: "Nous ne collectons, ne stockons ni ne suivons aucune information personnelle. Vos emails temporaires sont vraiment anonymes."
        },
        {
          icon: Eye,
          title: "Aucune Inscription Requise",
          desc: "Utilisez dropmail instantanément sans créer de compte. Pas d'email, pas de mot de passe, aucun détail personnel nécessaire."
        },
        {
          icon: Clock,
          title: "Suppression Automatique",
          desc: "Tous les emails temporaires sont automatiquement supprimés après 10 minutes. Prolongez si nécessaire, mais ils ne restent jamais indéfiniment."
        },
        {
          icon: Lock,
          title: "Sécurisé & Privé",
          desc: "Vos emails sont cryptés et accessibles uniquement pendant la session active. Pas de journaux, pas d'historique, pas de traces."
        }
      ],
      details: {
        title: "Détails de Confidentialité",
        items: [
          "Aucune collecte de données personnelles",
          "Génération d'emails anonymes",
          "Pas de cookies ni de suivi",
          "Aucun stockage de contenu",
          "Aucun enregistrement d'IP"
        ]
      }
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
                {/* Policy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {t.policies.map((policy, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 rounded-lg bg-gradient-to-r from-[#ff1616] to-[#faa61a] flex items-center justify-center">
                        <policy.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-base sm:text-lg mb-2 text-black">{policy.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{policy.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">{t.details.title}</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {t.details.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff1616] to-[#faa61a] mt-1.5 sm:mt-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
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

