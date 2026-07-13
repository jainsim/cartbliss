"use client";

import React from "react";
import { Bell, ExternalLink } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Post-reward cooling-off nudge (DESIGN-midnight.md §6). Opt-in, permission not
 *  pressure. Dismiss is the easy path. Partner = q-commerce (DECISIONS §4).
 *  "Remind me" is a local stub with honest copy — no fake email/push. */
const PARTNER = {
  name: "Zepto",
  url: "https://www.zeptonow.com",
};

export default function AffiliateBridge() {
  const { bridgeOpen, dismissBridge, setBridgeOpen, pushToast } = useCart();

  if (!bridgeOpen) return null;

  const remindLater = () => {
    try {
      const intent = { partner: PARTNER.name, ts: Date.now() };
      window.localStorage.setItem(
        "cartbliss-reminder",
        JSON.stringify(intent),
      );
    } catch {
      /* storage disabled — reminder is best-effort anyway */
    }
    if (typeof Notification !== "undefined") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          window.setTimeout(
            () => {
              new Notification("Still craving that? 🌙", {
                body: "It's a tap away →",
              });
            },
            60 * 60 * 1000,
          );
        }
      });
    }
    pushToast("Cool. If this tab's still around in an hour, we'll nudge you. 🌙");
    setBridgeOpen(false);
  };

  const orderReal = () => {
    window.open(PARTNER.url, "_blank", "noopener,noreferrer");
    setBridgeOpen(false);
  };

  return (
    <div className="fixed inset-0 z-checkout flex items-end">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismissBridge}
        className="absolute inset-0 h-full w-full animate-fade-in bg-black/40"
      />

      <div className="relative w-full animate-sheet-up flex-col gap-md rounded-t-xl border-t border-border bg-surface-elevated p-lg pb-section shadow-card">
        <div className="mx-auto mb-md h-1 w-12 rounded-full bg-border" />

        <div className="mb-lg flex flex-col gap-xs">
          <h2 className="text-xl font-bold text-hi">Craving won 🎉</h2>
          <p className="text-mid">
            Still want the real thing? Sleep on it — we&apos;ll nudge you in an
            hour.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          {/* Dismiss — default, largest, thumb-zone */}
          <button
            type="button"
            onClick={dismissBridge}
            className="min-h-cta rounded-full bg-primary text-lg font-bold text-white shadow-glow active:animate-pop"
          >
            Nah, I&apos;m satisfied 😌
          </button>

          {/* Remind me in an hour — highest-intent */}
          <button
            type="button"
            onClick={remindLater}
            className="flex min-h-touch items-center justify-center gap-sm rounded-full border border-border bg-surface text-base font-semibold text-hi active:animate-pop"
          >
            <Bell size={18} /> Remind me in an hour
          </button>

          {/* Order for real — present intent */}
          <button
            type="button"
            onClick={orderReal}
            className="flex min-h-touch items-center justify-center gap-sm text-base font-semibold text-mid active:animate-pop"
          >
            Order it for real on {PARTNER.name}
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
