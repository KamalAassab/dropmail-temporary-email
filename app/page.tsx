"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EmailCard } from "@/components/EmailCard";
import { TimerCard } from "@/components/TimerCard";
import { InboxList } from "@/components/InboxList";
import { MessageDetail } from "@/components/MessageDetail";
import { EmailGenerator } from "@/components/EmailGenerator";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { generateRandomString } from "@/lib/utils";
import {
  apiManager,
  Domain,
  Message,
  MessageDetail as MessageDetailType,
  APIProvider,
} from "@/lib/api-providers";

// localStorage keys
const STORAGE_KEYS = {
  email: "dropmail_email",
  password: "dropmail_password",
  token: "dropmail_token",
  accountId: "dropmail_accountId",
  messages: "dropmail_messages",
  view: "dropmail_view",
  emailCreatedAt: "dropmail_emailCreatedAt",
  timerRemaining: "dropmail_timerRemaining",
  timerLastUpdated: "dropmail_timerLastUpdated",
};

// Save email data to localStorage
const saveEmailData = (data: {
  email: string;
  password: string;
  token: string;
  accountId: string;
  messages: Message[];
  view: "generator" | "inbox" | "detail";
}, emailCreatedAt?: number) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.email, data.email);
  localStorage.setItem(STORAGE_KEYS.password, data.password);
  localStorage.setItem(STORAGE_KEYS.token, data.token);
  localStorage.setItem(STORAGE_KEYS.accountId, data.accountId);
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(data.messages));
  localStorage.setItem(STORAGE_KEYS.view, data.view);
  
  // Only update emailCreatedAt if provided (when email is first created)
  if (emailCreatedAt !== undefined) {
    localStorage.setItem(STORAGE_KEYS.emailCreatedAt, emailCreatedAt.toString());
  }
};

// Save timer state to localStorage
const saveTimerState = (timeLeft: number) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.timerRemaining, timeLeft.toString());
  localStorage.setItem(STORAGE_KEYS.timerLastUpdated, Date.now().toString());
};

// Load timer state from localStorage
const loadTimerState = (emailCreatedAt: number): number | null => {
  if (typeof window === 'undefined') return null;
  
  const timerRemainingStr = localStorage.getItem(STORAGE_KEYS.timerRemaining);
  const timerLastUpdatedStr = localStorage.getItem(STORAGE_KEYS.timerLastUpdated);
  
  if (!timerRemainingStr || !timerLastUpdatedStr) return null;
  
  try {
    const timerRemaining = parseInt(timerRemainingStr, 10);
    const timerLastUpdated = parseInt(timerLastUpdatedStr, 10);
    
    // Calculate how much time has passed since last save
    const secondsElapsed = Math.floor((Date.now() - timerLastUpdated) / 1000);
    
    // Subtract elapsed time from saved remaining time
    const actualRemaining = Math.max(0, timerRemaining - secondsElapsed);
    
    // Also calculate based on email creation time as backup
    const elapsedSinceCreation = Math.floor((Date.now() - emailCreatedAt) / 1000);
    const remainingFromCreation = Math.max(0, 600 - elapsedSinceCreation);
    
    // Use the minimum value (most accurate) - the timer that's furthest along
    // This ensures we don't show more time than actually remaining
    return Math.min(actualRemaining, remainingFromCreation);
  } catch (error) {
    console.error("Failed to parse timer state:", error);
    return null;
  }
};

// Load email data from localStorage
const loadEmailData = (): {
  email: string;
  password: string;
  token: string;
  accountId: string;
  messages: Message[];
  view: "generator" | "inbox" | "detail";
  emailCreatedAt: number;
} | null => {
  if (typeof window === 'undefined') return null;

  const email = localStorage.getItem(STORAGE_KEYS.email);
  const password = localStorage.getItem(STORAGE_KEYS.password);
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const accountId = localStorage.getItem(STORAGE_KEYS.accountId);
  const messagesStr = localStorage.getItem(STORAGE_KEYS.messages);
  const view = localStorage.getItem(STORAGE_KEYS.view) as "generator" | "inbox" | "detail" | null;
  const emailCreatedAtStr = localStorage.getItem(STORAGE_KEYS.emailCreatedAt);

  if (!email || !token || !accountId) return null;

  try {
    const messages: Message[] = messagesStr ? JSON.parse(messagesStr) : [];
    const emailCreatedAt = emailCreatedAtStr ? parseInt(emailCreatedAtStr, 10) : Date.now();
    
    return {
      email,
      password: password || "",
      token,
      accountId,
      messages,
      view: view || "inbox",
      emailCreatedAt,
    };
  } catch (error) {
    console.error("Failed to parse saved email data:", error);
    return null;
  }
};

// Clear email data from localStorage
const clearEmailData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.email);
  localStorage.removeItem(STORAGE_KEYS.password);
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.accountId);
  localStorage.removeItem(STORAGE_KEYS.messages);
  localStorage.removeItem(STORAGE_KEYS.view);
  localStorage.removeItem(STORAGE_KEYS.emailCreatedAt);
  localStorage.removeItem(STORAGE_KEYS.timerRemaining);
  localStorage.removeItem(STORAGE_KEYS.timerLastUpdated);
};

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageDetailType | null>(null);
  const [view, setView] = useState<"generator" | "inbox" | "detail">("generator");

  const { toasts, showToast, removeToast } = useToast();
  // Note: We'll manage timer state manually to restore from localStorage
  const [timeLeft, setTimeLeft] = useState(600);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inboxIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerWarningShownRef = useRef(false);
  const initializingRef = useRef(false);
  const checkingInboxRef = useRef(false);
  const emailCreatedAtRef = useRef<number>(Date.now());

  // Manual timer implementation to support restoring from localStorage
  useEffect(() => {
    // Only run timer if we have an email
    if (!email) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev <= 0 ? 0 : prev - 1;
        
        // Save timer state to localStorage every second when we have an email
        // Save even when timer reaches 0 to track expiry
        if (email) {
          saveTimerState(newTime);
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [email]);

  const extendTimer = () => {
    const now = Date.now();
    setTimeLeft(600); // Always reset to 10 minutes (600 seconds)
    emailCreatedAtRef.current = now;
    timerWarningShownRef.current = false;
    saveTimerState(600);
    
    // Update emailCreatedAt in localStorage when extending
    if (typeof window !== 'undefined' && email) {
      localStorage.setItem(STORAGE_KEYS.emailCreatedAt, now.toString());
    }
  };

  // Language effect
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as 'en' | 'fr' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = useCallback((lang: 'en' | 'fr') => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  }, []);

  // Handle timer expiry - redirect to home screen
  const handleTimerExpiry = useCallback(async () => {
    // Delete account from API if exists
    if (token && accountId) {
      try {
        await apiManager.deleteAccount(token, accountId);
      } catch (error) {
        console.error("Failed to delete account from API:", error);
      }
    }
    
    // Stop inbox auto-refresh
    if (inboxIntervalRef.current) {
      clearInterval(inboxIntervalRef.current);
      inboxIntervalRef.current = null;
    }
    
    // Stop timer interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Clear local state
    setView("generator");
    setEmail("");
    setPassword("");
    setToken("");
    setAccountId("");
    setMessages([]);
    setSelectedMessage(null);
    setTimeLeft(600); // Reset timer
    timerWarningShownRef.current = false;
    emailCreatedAtRef.current = Date.now();
    
    // Clear localStorage
    clearEmailData();
    
    const toastMessages = {
      en: "Timer expired! Please generate a new email.",
      fr: "Minuteur expiré! Veuillez générer un nouvel email.",
    };
    showToast(toastMessages[language], "info");
  }, [token, accountId, language, showToast]);

  // Timer expiry notification and redirect
  useEffect(() => {
    if (timeLeft === 0 && email && !timerWarningShownRef.current) {
      timerWarningShownRef.current = true;
      // Small delay to show the 00:00 state briefly before redirecting
      setTimeout(() => {
        handleTimerExpiry();
      }, 500);
    } else if (timeLeft === 60 && email && !timerWarningShownRef.current) {
      const toastMessages = {
        en: "Only 1 minute left!",
        fr: "Il ne reste qu'une minute!",
      };
      showToast(toastMessages[language], "info");
      timerWarningShownRef.current = true;
    } else if (timeLeft > 60) {
      timerWarningShownRef.current = false;
    }
  }, [timeLeft, email, showToast, language, handleTimerExpiry]);

  // Load available domains
  const loadDomains = useCallback(async () => {
    try {
      const fetchedDomains = await apiManager.getDomains();
      setDomains(fetchedDomains);
      return fetchedDomains;
    } catch (error) {
      console.error("Failed to load domains:", error);
      showToast("Failed to load domains. Please refresh.", "error");
      return [];
    }
  }, [showToast]);

  // Generate new email with custom username and domain
  const generateNewEmail = useCallback(async (
    customUsername?: string,
    customDomain?: string,
    provider?: APIProvider
  ) => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    setLoading(true);

    try {
      // Delete old account if exists
      if (token && accountId) {
        try {
          await apiManager.deleteAccount(token, accountId);
        } catch (error) {
          console.error("Failed to delete old account:", error);
        }
      }

      // Use Mail.tm - it actually works for receiving emails
      const selectedProvider = provider || "mail.tm";
      apiManager.setProvider(selectedProvider);

      // Get available domains if not already loaded
      let availableDomains = domains;
      if (availableDomains.length === 0) {
        availableDomains = await loadDomains();
      }

      if (availableDomains.length === 0) {
        throw new Error("No domains available");
      }

      // Use custom username or generate random one
      let username = customUsername || generateRandomString(10);
      const domain = customDomain || availableDomains[0].domain;

      const newPassword = generateRandomString(16);
      let newEmail = `${username}@${domain}`;
      let accountCreated = false;
      let attempts = 0;
      const maxAttempts = 2; // Try exact username first, then with suffix if needed

      // Store domain for API calls
      apiManager.setDomain(newEmail);

      // Try to create account with exact username first
      while (!accountCreated && attempts < maxAttempts) {
        try {
          // Create account (await for error handling, but don't need the result)
          await apiManager.createAccount(newEmail, newPassword);
          accountCreated = true;
        } catch (error: any) {
          // If username is already taken and we have a custom username, try with suffix
          if (
            attempts === 0 && 
            customUsername && 
            (error.message?.includes("already exists") || 
             error.message?.includes("already taken") ||
             error.message?.includes("400") ||
             error.message?.includes("409"))
          ) {
            attempts++;
            // Add a short random suffix only if username is taken
            const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            username = `${customUsername}${randomSuffix}`;
            newEmail = `${username}@${domain}`;
            apiManager.setDomain(newEmail);
            console.log(`Username "${customUsername}" was taken, trying "${username}"`);
          } else {
            // Re-throw if it's a different error or we've already tried once
            throw error;
          }
        }
      }

      // Get auth token
      const auth = await apiManager.getAuthToken(newEmail, newPassword);

      setEmail(newEmail);
      setPassword(newPassword);
      setToken(auth.token);
      setAccountId(auth.id);
      setMessages([]);
      setSelectedMessage(null);
      setView("inbox");
      const now = Date.now();
      emailCreatedAtRef.current = now;
      setTimeLeft(600);
      timerWarningShownRef.current = false;
      
      // Save timer state immediately
      saveTimerState(600);
      
      // Save to localStorage with emailCreatedAt timestamp
      saveEmailData({
        email: newEmail,
        password: newPassword,
        token: auth.token,
        accountId: auth.id,
        messages: [],
        view: "inbox",
      }, now);

      const successMessages = {
        en: "Email generated successfully! 🎉",
        fr: "Email généré avec succès! 🎉",
      };
      showToast(successMessages[language], "success");
    } catch (error: any) {
      console.error("Failed to generate email:", error);
      
      // Better error handling with translations
      const errorMessages = {
        en: {
          default: "Failed to generate email. Please try again.",
          rateLimited: "⏱️ Rate limit reached. Please wait 10-15 minutes and try again.",
          usernameTaken: "Username taken. Try adding numbers or different name.",
          tokenExpired: "Session expired. Generating new email...",
          networkError: "Network error. Check your connection.",
        },
        fr: {
          default: "Échec de la génération de l'email. Veuillez réessayer.",
          rateLimited: "⏱️ Limite de taux atteinte. Veuillez attendre 10-15 minutes et réessayer.",
          usernameTaken: "Nom d'utilisateur pris. Essayez d'ajouter des chiffres ou un nom différent.",
          tokenExpired: "Session expirée. Génération d'un nouvel email...",
          networkError: "Erreur réseau. Vérifiez votre connexion.",
        },
      };

      let errorMessage = errorMessages[language].default;
      
      if (error.message?.includes("RATE_LIMITED")) {
        errorMessage = errorMessages[language].rateLimited;
      } else if (error.message?.includes("already exists") || error.message?.includes("already taken")) {
        errorMessage = errorMessages[language].usernameTaken;
      } else if (error.message?.includes("TOKEN_EXPIRED")) {
        errorMessage = errorMessages[language].tokenExpired;
      } else if (error.message?.includes("Network")) {
        errorMessage = errorMessages[language].networkError;
      }
      
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
      initializingRef.current = false;
    }
  }, [token, accountId, domains, showToast, loadDomains, language]);

  // Check inbox - using ref to prevent concurrent calls
  const checkInbox = useCallback(async () => {
    if (!token) return;
    
    // Prevent multiple simultaneous inbox checks
    if (checkingInboxRef.current) return;
    checkingInboxRef.current = true;
    setLoading(true);

    try {
      const fetchedMessages = await apiManager.getMessages(token);
      const sortedMessages = fetchedMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Preserve 'seen' status from existing messages when merging with new messages
      setMessages((prevMessages) => {
        const seenMap = new Map(prevMessages.map(msg => [msg.id, msg.seen]));
        return sortedMessages.map(msg => ({
          ...msg,
          seen: seenMap.get(msg.id) ?? msg.seen ?? false
        }));
      });
    } catch (error: any) {
      if (error.message === "TOKEN_EXPIRED" || error.message?.includes("401")) {
        // Try to re-authenticate if we have password
        if (password && email) {
          try {
            const auth = await apiManager.getAuthToken(email, password);
            setToken(auth.token);
            // Retry fetching messages
            const fetchedMessages = await apiManager.getMessages(auth.token);
            const sortedMessages = fetchedMessages.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            // Preserve 'seen' status from existing messages
            setMessages((prevMessages) => {
              const seenMap = new Map(prevMessages.map(msg => [msg.id, msg.seen]));
              return sortedMessages.map(msg => ({
                ...msg,
                seen: seenMap.get(msg.id) ?? msg.seen ?? false
              }));
            });
            return;
          } catch (reauthError) {
            console.error("Re-authentication failed:", reauthError);
          }
        }
        
        // If re-auth fails or no password, clear saved data
        clearEmailData();
        const toastMessages = {
          en: "Session expired. Please generate a new email.",
          fr: "Session expirée. Veuillez générer un nouvel email.",
        };
        showToast(toastMessages[language], "error");
        setView("generator");
        setEmail("");
        setPassword("");
        setToken("");
        setAccountId("");
        setMessages([]);
      } else {
        console.error("Failed to check inbox:", error);
      }
    } finally {
      checkingInboxRef.current = false;
      setLoading(false);
    }
  }, [token, password, email, showToast, language]);

  // Auto-refresh inbox and verify token on restore
  useEffect(() => {
    if (token && view === "inbox") {
      // Initial check - verify token and fetch messages
      checkInbox();

      // Set up interval for auto-refresh
      inboxIntervalRef.current = setInterval(() => {
        checkInbox();
      }, 5000);

      return () => {
        if (inboxIntervalRef.current) {
          clearInterval(inboxIntervalRef.current);
          inboxIntervalRef.current = null;
        }
      };
    } else {
      // Stop auto-refresh when not in inbox view or no email
      if (inboxIntervalRef.current) {
        clearInterval(inboxIntervalRef.current);
        inboxIntervalRef.current = null;
      }
    }
  }, [token, view, email, checkInbox]);

  // Restore saved email data on mount
  useEffect(() => {
    if (!showSplash) {
      const savedData = loadEmailData();
      if (savedData) {
        emailCreatedAtRef.current = savedData.emailCreatedAt;
        
        // Try to restore timer from localStorage (more accurate)
        const restoredTimer = loadTimerState(savedData.emailCreatedAt);
        
        // Calculate remaining time based on when email was created (10 minutes = 600 seconds) as fallback
        const elapsedSeconds = Math.floor((Date.now() - savedData.emailCreatedAt) / 1000);
        const remainingFromCreation = Math.max(0, 600 - elapsedSeconds);
        
        // Use restored timer if available, otherwise use calculation from creation time
        const remainingSeconds = restoredTimer !== null && restoredTimer > 0 
          ? restoredTimer 
          : remainingFromCreation;
        
        if (remainingSeconds > 0) {
          // Restore email data
          setEmail(savedData.email);
          setPassword(savedData.password);
          setToken(savedData.token);
          setAccountId(savedData.accountId);
          setMessages(savedData.messages);
          
          // Only restore view if it's not 'detail' (since selectedMessage might be null)
          // If it was detail view, restore to inbox instead
          if (savedData.view === 'detail') {
            setView('inbox');
          } else {
            setView(savedData.view);
          }
          
          // Restore timer to remaining time
          setTimeLeft(remainingSeconds);
          
          // Save the restored timer state
          saveTimerState(remainingSeconds);
          
          // Verify token is still valid by trying to fetch messages
          // This will be handled by the checkInbox effect below
        } else {
          // Email expired, clear saved data
          clearEmailData();
          const toastMessages = {
            en: "Your temporary email has expired. Please generate a new one.",
            fr: "Votre email temporaire a expiré. Veuillez en générer un nouveau.",
          };
          showToast(toastMessages[language], "info");
          
          // Load domains if needed
          if (domains.length === 0) {
            loadDomains();
          }
        }
      } else {
        // No saved data, load domains
        if (domains.length === 0) {
          loadDomains();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplash]);

  // Save email data whenever it changes (don't update emailCreatedAt on every save)
  useEffect(() => {
    if (email && token && accountId && !showSplash) {
      // Only pass emailCreatedAt if it's a new email (check if it changed)
      const currentSavedEmail = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.email) : null;
      const shouldUpdateCreatedAt = currentSavedEmail !== email;
      
      saveEmailData({
        email,
        password,
        token,
        accountId,
        messages,
        view,
      }, shouldUpdateCreatedAt ? emailCreatedAtRef.current : undefined);
    }
  }, [email, password, token, accountId, messages, view, showSplash]);

  // Save messages whenever they change (merged into main save effect above)

  // Initialize app - load domains on splash complete (only if no saved email)
  useEffect(() => {
    if (!showSplash && domains.length === 0 && !email) {
      loadDomains();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSplash, domains.length, email]);

  const handleOpenMessage = async (messageId: string) => {
    setLoading(true);
    try {
      const messageDetail = await apiManager.getMessage(token, messageId);
      setSelectedMessage(messageDetail);
      setView("detail");
      
      // Mark message as seen/opened in the messages list
      setMessages((prevMessages) => {
        const updated = prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, seen: true } : msg
        );
        
        // Save updated messages to localStorage immediately
        if (email && token && accountId) {
          saveEmailData({
            email,
            password,
            token,
            accountId,
            messages: updated,
            view: "detail",
          });
        }
        
        return updated;
      });
    } catch (error) {
      console.error("Failed to fetch message:", error);
      showToast("Failed to load message", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    setLoading(true);
    try {
      await apiManager.deleteMessage(token, selectedMessage.id);
      const updatedMessages = messages.filter((m) => m.id !== selectedMessage.id);
      setMessages(updatedMessages);
      setView("inbox");
      setSelectedMessage(null);
      
      // Save updated messages to localStorage immediately
      if (email && token && accountId) {
        saveEmailData({
          email,
          password,
          token,
          accountId,
          messages: updatedMessages,
          view: "inbox",
        });
      }
      
      const toastMessages = {
        en: "Message deleted successfully",
        fr: "Message supprimé avec succès",
      };
      showToast(toastMessages[language], "success");
    } catch (error) {
      console.error("Failed to delete message:", error);
      const toastMessages = {
        en: "Failed to delete message",
        fr: "Échec de la suppression du message",
      };
      showToast(toastMessages[language], "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = () => {
    const toastMessages = {
      en: "Email copied to clipboard! 📋",
      fr: "Email copié dans le presse-papiers! 📋",
    };
    showToast(toastMessages[language], "success");
  };

  const handleExtendTimer = () => {
    extendTimer(); // Now resets to 10 minutes (600 seconds)
    timerWarningShownRef.current = false;
    const toastMessages = {
      en: "Timer reset to 10 minutes! ⏰",
      fr: "Minuteur réinitialisé à 10 minutes! ⏰",
    };
    showToast(toastMessages[language], "success");
  };

  const handleChangeEmail = () => {
    setView("generator");
  };

  const handleDeleteEmail = async () => {
    // Delete account from API
    if (token && accountId) {
      try {
        await apiManager.deleteAccount(token, accountId);
      } catch (error) {
        console.error("Failed to delete account from API:", error);
      }
    }
    
    // Stop inbox auto-refresh
    if (inboxIntervalRef.current) {
      clearInterval(inboxIntervalRef.current);
      inboxIntervalRef.current = null;
    }
    
    // Clear local state
    setView("generator");
    setEmail("");
    setPassword("");
    setToken("");
    setAccountId("");
    setMessages([]);
    setSelectedMessage(null);
    setTimeLeft(600); // Reset timer
    timerWarningShownRef.current = false;
    emailCreatedAtRef.current = Date.now();
    
    // Clear localStorage
    clearEmailData();
    
    const toastMessages = {
      en: "Email deleted. Generate a new one! 🗑️",
      fr: "Email supprimé. Générez-en un nouveau! 🗑️",
    };
    showToast(toastMessages[language], "success");
  };

  const handleBackToInbox = () => {
    setView("inbox");
    setSelectedMessage(null);
  };

  const handleGenerateEmail = (username: string, domain: string, provider: APIProvider) => {
    generateNewEmail(username, domain, provider);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen
            key="splash"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen bg-white flex flex-col">
          <Header language={language} onLanguageChange={handleLanguageChange} />
          
          {view === "generator" && !email && (
            <HeroSection language={language} />
          )}

          <main className={`container mx-auto px-3 sm:px-4 md:px-6 flex-1 ${view === "inbox" ? "py-4 sm:py-6 flex flex-col min-h-0" : "py-4 sm:py-6 md:py-8"} max-w-7xl`}>
            {view === "generator" && (
              <div className="space-y-6 sm:space-y-8 md:space-y-10">
                <EmailGenerator
                  domains={domains}
                  onGenerate={handleGenerateEmail}
                  loading={loading}
                  language={language}
                />
                <FAQSection language={language} />
              </div>
            )}
            
            {view === "inbox" && (
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.85fr] gap-4 sm:gap-5 md:gap-6 flex-1 min-h-0">
                {/* Grid 1: Inbox Messages */}
                <div className="order-2 lg:order-1 h-full flex flex-col min-h-0">
                  <div className="h-full overflow-hidden flex flex-col">
                    <InboxList
                      messages={messages}
                      onRefresh={checkInbox}
                      onOpenMessage={handleOpenMessage}
                      loading={loading}
                      language={language}
                    />
                  </div>
                </div>

                {/* Grid 2: Email Management Section */}
                <div className="order-1 lg:order-2 h-full flex flex-col space-y-3 sm:space-y-4 min-h-0">
                  {/* Email Card */}
                  {email && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex-shrink-0"
                    >
                      <EmailCard email={email} onCopy={handleCopyEmail} language={language} />
                    </motion.div>
                  )}

                  {/* Timer Card with Action Buttons */}
                  <div className="flex-shrink-0">
                    <TimerCard 
                      timeLeft={timeLeft} 
                      onExtend={handleExtendTimer}
                      onChangeEmail={handleChangeEmail}
                      onDeleteEmail={handleDeleteEmail}
                      loading={loading}
                      language={language} 
                    />
                  </div>
                </div>
              </div>
            )}

            {view === "detail" && selectedMessage && (
              <MessageDetail
                message={selectedMessage}
                onBack={handleBackToInbox}
                onDelete={handleDeleteMessage}
                language={language}
              />
            )}
          </main>

          <Footer language={language} />
          
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      )}
    </>
  );
}
