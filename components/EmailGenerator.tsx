"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown, Sparkles, Shuffle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Domain, APIProvider } from "@/lib/api-providers";
import { generateRandomString } from "@/lib/utils";

interface EmailGeneratorProps {
  domains: Domain[];
  onGenerate: (username: string, domain: string, provider: APIProvider) => void;
  loading: boolean;
  language: 'en' | 'fr';
}

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({
  domains,
  onGenerate,
  loading,
  language,
}) => {
  const translations = {
    en: {
      generateEmail: "Generate Email",
      customize: "Customize your temporary email",
      username: "Username (Optional)",
      leaveEmpty: "Leave empty for random",
      preview: "Preview",
      selectDomain: "Select Domain",
    },
    fr: {
      generateEmail: "Générer un Email",
      customize: "Personnalisez votre email temporaire",
      username: "Nom d'utilisateur (Optionnel)",
      leaveEmpty: "Laisser vide pour aléatoire",
      preview: "Aperçu",
      selectDomain: "Sélectionner un Domaine",
    },
  };

  const t = translations[language];
  const [username, setUsername] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [showDomains, setShowDomains] = useState(false);
  const provider: APIProvider = "mail.tm"; // Using Mail.tm - ACTUALLY WORKS for receiving emails!

  // Use domains from Mail.tm API (these ACTUALLY receive emails)
  // Custom usernames will have a random suffix added to ensure uniqueness
  const enhancedDomains: Domain[] = domains.length > 0 
    ? domains 
    : [{ id: "default", domain: "2200freefonts.com" }]; // Fallback domain from Mail.tm

  useEffect(() => {
    if (enhancedDomains.length > 0 && !selectedDomain) {
      setSelectedDomain(enhancedDomains[0].domain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain]);

  const generateRandomUsername = () => {
    const randomUsername = generateRandomString(10);
    setUsername(randomUsername);
  };

  const handleGenerate = () => {
    if (!selectedDomain) return; // Prevent generation without domain
    const finalUsername = username.trim() || generateRandomString(10);
    onGenerate(finalUsername, selectedDomain, provider);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff1616]/10 via-[#faa61a]/5 to-[#faa61a]/10" />
        
        <div className="relative p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gradient-to-br from-[#ff1616] to-[#faa61a] p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold truncate">{t.generateEmail}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{t.customize}</p>
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-foreground">{t.username}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                placeholder={t.leaveEmpty}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-muted/50 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-all"
                maxLength={20}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={generateRandomUsername}
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11"
              >
                <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
              {username && (
              <p className="text-xs text-muted-foreground break-all">
                {t.preview}: <span className="font-semibold break-all">{username}@{selectedDomain}</span>
              </p>
            )}
          </div>

          {/* Domain Selection */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-foreground">{t.selectDomain}</label>
            <div className="relative">
              <button
                onClick={() => setShowDomains(!showDomains)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-muted/50 rounded-lg border-2 border-border hover:border-primary transition-all flex items-center justify-between group"
              >
                <span className="font-medium truncate flex-1 text-left">@{selectedDomain}</span>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ml-2 ${showDomains ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDomains && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-lg shadow-xl max-h-48 sm:max-h-60 overflow-y-auto"
                  >
                    {enhancedDomains.map((domain) => (
                      <motion.button
                        key={domain.id}
                        whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                        onClick={() => {
                          setSelectedDomain(domain.domain);
                          setShowDomains(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-left hover:bg-accent transition-colors ${
                          selectedDomain === domain.domain ? 'bg-primary/10 text-primary font-semibold' : ''
                        }`}
                      >
                        @{domain.domain}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerate}
            disabled={loading || !selectedDomain}
            className="w-full text-sm sm:text-base md:text-lg py-3 sm:py-4 h-auto"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex items-center justify-center"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                {t.generateEmail}
              </span>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

