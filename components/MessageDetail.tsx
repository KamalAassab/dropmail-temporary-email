"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, User } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageDetail as MessageDetailType } from "@/lib/api-providers";
import { formatTimeAgo } from "@/lib/utils";

interface MessageDetailProps {
  message: MessageDetailType;
  onBack: () => void;
  onDelete: () => void;
  language: 'en' | 'fr';
}

export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onBack,
  onDelete,
  language,
}) => {
  const translations = {
    en: {
      messageDetails: "Message Details",
      to: "To:",
      noSubject: "(No Subject)",
      noContent: "No content available",
      deleteMessage: "Delete Message",
    },
    fr: {
      messageDetails: "Détails du Message",
      to: "À:",
      noSubject: "(Aucun Sujet)",
      noContent: "Aucun contenu disponible",
      deleteMessage: "Supprimer le Message",
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
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 sm:space-y-4"
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-11 hover:scale-110 transition-transform"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex-1 truncate">{t.messageDetails}</h2>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-[#ff1616]/10 to-[#faa61a]/10 p-4 sm:p-5 md:p-6 border-b">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#ff1616] to-[#faa61a] flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl flex-shrink-0 shadow-xl"
            >
              {getInitials(message.from.name, message.from.address)}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 truncate">
                {message.from.name || message.from.address}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-all">
                {message.from.address}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(message.createdAt), language)}
              </p>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">
            {message.subject || t.noSubject}
          </h1>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
              <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium">{t.to}</span>
              <span className="break-all">{message.to[0]?.address}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert text-xs sm:text-sm">
            {message.html && message.html.length > 0 ? (
              <div
                className="message-content break-words overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: message.html[0] }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-foreground break-words">
                {message.text || message.intro || t.noContent}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 border-t bg-muted/30">
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full text-sm sm:text-base py-2 sm:py-3 h-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              {t.deleteMessage}
            </span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

