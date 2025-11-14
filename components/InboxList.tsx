"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, RefreshCw, Inbox } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Message } from "@/lib/api-providers";
import { formatTimeAgo } from "@/lib/utils";

interface InboxListProps {
  messages: Message[];
  onRefresh: () => void;
  onOpenMessage: (id: string) => void;
  loading: boolean;
  language: 'en' | 'fr';
}

export const InboxList: React.FC<InboxListProps> = ({
  messages,
  onRefresh,
  onOpenMessage,
  loading,
  language,
}) => {
  const translations = {
    en: {
      inbox: "Inbox",
      refresh: "Refresh",
      emptyInbox: "Your inbox is empty",
      waiting: "Waiting for incoming emails...",
      new: "New",
      opened: "Opened",
      noSubject: "(No Subject)",
      noPreview: "No preview available",
    },
    fr: {
      inbox: "Boîte de Réception",
      refresh: "Actualiser",
      emptyInbox: "Votre boîte de réception est vide",
      waiting: "En attente d'emails entrants...",
      new: "Nouveau",
      opened: "Ouvert",
      noSubject: "(Aucun Sujet)",
      noPreview: "Aucun aperçu disponible",
    },
  };

  const t = translations[language];

  const getInitials = (name: string, email: string): string => {
    if (name && name !== email) {
      return name.charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full flex flex-col min-h-0"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold truncate flex-1">{t.inbox}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRefresh();
          }}
          disabled={loading}
          type="button"
          className="flex-shrink-0 hover:border-[#ff1616] hover:text-[#ff1616] hover:bg-[#ff1616]/5 transition-all text-xs sm:text-sm"
        >
          <motion.div
            animate={loading ? { 
              rotate: 360,
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              rotate: { 
                duration: 0.8, 
                repeat: loading ? Infinity : 0, 
                ease: "linear" 
              },
              scale: {
                duration: 1.2,
                repeat: loading ? Infinity : 0,
                ease: "easeInOut"
              }
            }}
            whileHover={!loading ? { 
              scale: 1.15, 
              rotate: 180,
            } : {}}
            whileTap={{ scale: 0.9 }}
            className="flex items-center"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-colors ${
              loading ? "text-[#ff1616]" : ""
            }`} strokeWidth={loading ? 2.5 : 2} />
          </motion.div>
          <span className="font-medium hidden sm:inline">{t.refresh}</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-6 sm:p-8 md:p-12 text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block mb-3 sm:mb-4"
                >
                  <Inbox className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-muted-foreground mx-auto" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{t.emptyInbox}</h3>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  {t.waiting}
                </p>
              </Card>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <Card
                  className="p-3 sm:p-4 cursor-pointer hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 hover:border-primary/50"
                  onClick={() => onOpenMessage(message.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#ff1616] to-[#faa61a] flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-lg"
                    >
                      {getInitials(message.from.name, message.from.address)}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground truncate flex-1">
                          {message.from.name || message.from.address}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {formatTimeAgo(new Date(message.createdAt), language)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-foreground/90 mb-1 truncate">
                        {message.subject || t.noSubject}
                      </p>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {message.intro || t.noPreview}
                      </p>

                      {message.seen ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                        >
                          <Mail className="w-3 h-3" />
                          {t.opened}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          <Mail className="w-3 h-3" />
                          {t.new}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

