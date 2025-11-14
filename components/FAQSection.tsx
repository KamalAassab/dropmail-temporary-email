"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQSectionProps {
  language: 'en' | 'fr';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about dropmail",
      faqs: [
        {
          q: "How does dropmail work?",
          a: "dropmail generates temporary email addresses that you can use instantly. These addresses receive emails for 10 minutes before auto-deleting. No registration required!"
        },
        {
          q: "Is dropmail really free?",
          a: "Yes! dropmail is 100% free to use. No hidden fees, no subscriptions, no payment required. Generate unlimited temporary emails anytime."
        },
        {
          q: "How long do emails last?",
          a: "By default, your temporary email lasts for 10 minutes. You can extend this time by clicking the 'Extend' button to add another 10 minutes."
        },
        {
          q: "Can I choose my own email address?",
          a: "Yes! You can enter a custom username, and we'll add a unique suffix to ensure it works. You can also choose from multiple domains."
        },
        {
          q: "Will I receive verification codes?",
          a: "Absolutely! Dropmail receives all emails including verification codes, password resets, and newsletters. Check your inbox after signing up."
        },
        {
          q: "Is my data private and secure?",
          a: "Yes! We don't store any personal information. Your temporary emails auto-delete after the time expires. Zero trace, complete privacy."
        },
        {
          q: "Can I use Dropmail for important accounts?",
          a: "Dropmail is best for temporary needs like testing, signups, or downloading content. For important accounts, use your permanent email."
        },
        {
          q: "What if I need the email longer?",
          a: "Simply click the 'Extend' button before the timer expires to add 10 more minutes. You can extend multiple times."
        }
      ]
    },
    fr: {
      title: "Questions Fréquemment Posées",
      subtitle: "Tout ce que vous devez savoir sur dropmail",
      faqs: [
        {
          q: "Comment fonctionne dropmail?",
          a: "dropmail génère des adresses email temporaires que vous pouvez utiliser instantanément. Ces adresses reçoivent des emails pendant 10 minutes avant suppression automatique. Aucune inscription requise!"
        },
        {
          q: "dropmail est-il vraiment gratuit?",
          a: "Oui! dropmail est 100% gratuit. Pas de frais cachés, pas d'abonnement, aucun paiement requis. Générez des emails temporaires illimités à tout moment."
        },
        {
          q: "Combien de temps durent les emails?",
          a: "Par défaut, votre email temporaire dure 10 minutes. Vous pouvez prolonger ce temps en cliquant sur le bouton 'Prolonger' pour ajouter 10 minutes."
        },
        {
          q: "Puis-je choisir ma propre adresse email?",
          a: "Oui! Vous pouvez entrer un nom d'utilisateur personnalisé, et nous ajouterons un suffixe unique pour garantir son fonctionnement. Vous pouvez également choisir parmi plusieurs domaines."
        },
        {
          q: "Vais-je recevoir les codes de vérification?",
          a: "Absolument! Dropmail reçoit tous les emails, y compris les codes de vérification, les réinitialisations de mot de passe et les newsletters. Consultez votre boîte de réception après l'inscription."
        },
        {
          q: "Mes données sont-elles privées et sécurisées?",
          a: "Oui! Nous ne stockons aucune information personnelle. Vos emails temporaires sont automatiquement supprimés après expiration. Zéro trace, confidentialité totale."
        },
        {
          q: "Puis-je utiliser Dropmail pour des comptes importants?",
          a: "Dropmail est idéal pour les besoins temporaires comme les tests, les inscriptions ou le téléchargement de contenu. Pour les comptes importants, utilisez votre email permanent."
        },
        {
          q: "Et si j'ai besoin de l'email plus longtemps?",
          a: "Cliquez simplement sur le bouton 'Prolonger' avant l'expiration du minuteur pour ajouter 10 minutes supplémentaires. Vous pouvez prolonger plusieurs fois."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div id="faq" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-r from-[#ff1616] to-[#faa61a] flex items-center justify-center">
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 px-2">{t.title}</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">{t.subtitle}</p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {t.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors gap-3"
              >
                <span className="font-semibold text-sm sm:text-base md:text-lg text-black flex-1 text-left">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-[#ff1616] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 md:px-6 pb-3 sm:pb-4 md:pb-5 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
