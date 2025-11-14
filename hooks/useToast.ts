"use client";

import { useState, useCallback } from "react";
import { ToastProps, ToastType } from "@/components/ui/toast";

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: ToastProps = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
};

