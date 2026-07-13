"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

/** Lightweight toast stack, above the nav, below modals' own layers. */
export default function ToastStack() {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-section z-toast flex flex-col items-center gap-sm px-lg">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-tick rounded-full bg-hi px-lg py-sm text-sm font-semibold text-bg shadow-card"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
