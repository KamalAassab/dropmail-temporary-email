"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";

interface HeaderProps {
  language: 'en' | 'fr';
  onLanguageChange: (lang: 'en' | 'fr') => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const languages = [
    { code: 'en' as const, label: 'English', flag: '/english.svg' },
    { code: 'fr' as const, label: 'Français', flag: '/french.svg' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const translations = {
    en: {
      privacy: "Privacy",
      terms: "Terms",
      faq: "FAQ",
      language: "Language",
    },
    fr: {
      privacy: "Confidentialité",
      terms: "Conditions",
      faq: "FAQ",
      language: "Langue",
    },
  };

  const t = translations[language];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleNavClick = (action: () => void) => {
    action();
    setShowMobileMenu(false);
  };

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    onLanguageChange(lang);
    setShowLangMenu(false);
    setShowMobileMenu(false);
  };

  const handleFAQClick = () => {
    setShowMobileMenu(false);
    setTimeout(() => {
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm"
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between h-14 sm:h-16 relative">
          {/* Logo - Centered on mobile/tablet, left on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-center flex-1 lg:flex-none lg:justify-start"
          >
            <Link 
              href="/" 
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center"
              onClick={() => setShowMobileMenu(false)}
            >
              <img 
                src="/logo.png" 
                alt="dropmail Logo" 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                style={{ maxWidth: 'min(160px, 35vw)' }}
              />
            </Link>
          </motion.div>

          {/* Logo and Navigation - Desktop only */}
          <div className="hidden lg:flex items-center gap-4 sm:gap-5 md:gap-6 flex-1 min-w-0">
            {/* Desktop Navigation - Beside Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 xl:gap-5 ml-4 xl:ml-6"
            >
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-sm font-medium text-gray-700 hover:text-[#ff1616] transition-colors whitespace-nowrap"
              >
                {t.privacy}
              </button>
              <button
                onClick={() => setShowTerms(true)}
                className="text-sm font-medium text-gray-700 hover:text-[#ff1616] transition-colors whitespace-nowrap"
              >
                {t.terms}
              </button>
              <a 
                href="#faq" 
                className="text-sm font-medium text-gray-700 hover:text-[#ff1616] transition-colors whitespace-nowrap"
              >
                {t.faq}
              </a>
            </motion.div>
          </div>

          {/* Right Side - Desktop Language & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop Language Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex items-center"
            >
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 h-8 px-2.5 border-gray-200 hover:border-[#ff1616] bg-white text-xs"
                >
                  <img 
                    src={currentLang.flag} 
                    alt={currentLang.label} 
                    className="w-3.5 h-3.5 object-contain" 
                  />
                  <span className="font-medium">{currentLang.label}</span>
                  <ChevronRight 
                    className={`w-3 h-3 transition-transform duration-200 ${
                      showLangMenu ? 'rotate-90' : ''
                    }`} 
                  />
                </Button>

                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full px-3 py-2 flex items-center gap-2.5 transition-all text-xs ${
                            language === lang.code
                              ? 'bg-gradient-to-r from-[#ff1616] to-[#faa61a] text-white'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <img 
                            src={lang.flag} 
                            alt={lang.label} 
                            className="w-4 h-4 object-contain" 
                          />
                          <span className="font-medium">{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors relative z-50"
              aria-label="Menu"
              aria-expanded={showMobileMenu}
            >
              <AnimatePresence mode="wait">
                {showMobileMenu ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Side Drawer Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] lg:hidden"
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300 
              }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/logo.png" 
                    alt="dropmail" 
                    className="h-7 w-auto object-contain"
                  />
                  <span className="text-base font-semibold text-gray-800">Menu</span>
                </div>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="px-4 py-4 space-y-0.5">
                {/* Navigation Items */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNavClick(() => setShowPrivacy(true))}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#ff1616] rounded-lg transition-all flex items-center justify-between group"
                  >
                    <span>{t.privacy}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff1616] transition-colors" />
                  </button>

                  <button
                    onClick={() => handleNavClick(() => setShowTerms(true))}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#ff1616] rounded-lg transition-all flex items-center justify-between group"
                  >
                    <span>{t.terms}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff1616] transition-colors" />
                  </button>

                  <button
                    onClick={handleFAQClick}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#ff1616] rounded-lg transition-all flex items-center justify-between group"
                  >
                    <span>{t.faq}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#ff1616] transition-colors" />
                  </button>
                </div>

                {/* Language Selector Section */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="px-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {t.language}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-3 py-2.5 flex items-center gap-2.5 rounded-lg transition-all text-sm ${
                          language === lang.code
                            ? 'bg-gradient-to-r from-[#ff1616] to-[#faa61a] text-white shadow-sm'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.label} 
                          className="w-5 h-5 object-contain flex-shrink-0" 
                        />
                        <span className="font-medium flex-1 text-left">
                          {lang.label}
                        </span>
                        {language === lang.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-white"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        language={language}
      />
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        language={language}
      />
    </>
  );
};
