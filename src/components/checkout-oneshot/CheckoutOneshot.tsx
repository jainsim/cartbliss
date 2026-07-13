"use client";

import React from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** One-tap ₹0 checkout. Pre-filled fake UPI, no account (DECISIONS §4). Pay
 *  hands off to the reward burst. */
export default function CheckoutOneshot() {
  const { checkoutOpen, setCheckoutOpen, pay, cartCount } = useCart();

  if (!checkoutOpen) return null;

  return (
    <div className="fixed inset-0 z-checkout">
      <button
        type="button"
        aria-label="Close checkout"
        onClick={() => setCheckoutOpen(false)}
        className="absolute inset-0 h-full w-full animate-fade-in bg-black/60"
      />

      <div className="absolute inset-x-0 bottom-0 flex animate-sheet-up flex-col gap-lg rounded-t-xl border-t border-border bg-surface-elevated p-lg pb-section shadow-card">
        <div className="mx-auto h-1 w-12 rounded-full bg-border" />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-hi">
            Pay ₹0 — forever free, forever fake
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setCheckoutOpen(false)}
            className="grid min-h-touch min-w-touch place-items-center rounded-full text-mid active:animate-pop"
          >
            <X size={22} />
          </button>
        </div>

        {/* Fake UPI (pre-filled) */}
        <div className="flex items-center gap-md rounded-lg border border-border bg-surface p-md">
          <div className="grid size-11 place-items-center rounded-full bg-mint/20 text-mint">
            <Check size={20} />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold text-hi">UPI · cravings@cartbliss</span>
            <span className="text-xs text-mid">Pre-filled · no account needed</span>
          </div>
          <span className="rounded-full bg-mint/15 px-sm py-xxs text-xs font-semibold text-mint">
            Ready
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-mid">
            {cartCount} item{cartCount === 1 ? "" : "s"} · you pay
          </span>
          <span className="text-3xl font-extrabold text-hi">₹0</span>
        </div>

        <button
          type="button"
          onClick={pay}
          className="min-h-cta rounded-full bg-primary text-lg font-bold text-white shadow-glow active:animate-pop"
        >
          Pay ₹0
        </button>

        <p className="flex items-center justify-center gap-xs text-xs text-low">
          <ShieldCheck size={14} /> No real money moves. Ever.
        </p>
      </div>
    </div>
  );
}
