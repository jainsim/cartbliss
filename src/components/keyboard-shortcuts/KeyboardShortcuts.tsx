"use client";

import React, { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toggleTheme } from "@/lib/theme";

/** Desktop power-user layer: single-key shortcuts (YouTube-style) plus a `?`
 *  help overlay. Purely additive — touch/mobile flow is untouched. Feed arrow
 *  navigation lives in CravingFeed; this handles actions + overlays. */
export default function KeyboardShortcuts() {
  const {
    setTab,
    hoardOpen,
    setHoardOpen,
    checkoutOpen,
    setCheckoutOpen,
    rewardOpen,
    closeReward,
    bridgeOpen,
    dismissBridge,
    pay,
    cart,
    activeCardApi,
  } = useCart();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      const key = e.key;

      // Let focused buttons/links handle Enter/Space natively (no double-fire).
      if (
        (key === "Enter" || key === " ") &&
        t &&
        (t.tagName === "BUTTON" || t.tagName === "A")
      )
        return;

      // Help overlay owns the keyboard while open.
      if (helpOpen) {
        if (key === "?" || key === "Escape") {
          e.preventDefault();
          setHelpOpen(false);
        }
        return;
      }
      if (key === "?") {
        e.preventDefault();
        setHelpOpen(true);
        return;
      }

      // Overlays, most-modal first.
      if (rewardOpen) {
        if (key === "Enter" || key === " " || key === "Escape") {
          e.preventDefault();
          closeReward();
        }
        return;
      }
      if (bridgeOpen) {
        if (key === "Enter" || key === "Escape") {
          e.preventDefault();
          dismissBridge();
        }
        return;
      }
      if (checkoutOpen) {
        if (key === "p" || key === "Enter") {
          e.preventDefault();
          pay();
        } else if (key === "Escape") {
          e.preventDefault();
          setCheckoutOpen(false);
        }
        return;
      }
      if (hoardOpen) {
        if (key === "Enter" || key === "x") {
          e.preventDefault();
          if (cart.length > 0) setCheckoutOpen(true);
        } else if (key === "Escape") {
          e.preventDefault();
          setHoardOpen(false);
        }
        return;
      }

      // Base context (feed / streak / profile, no overlay).
      switch (key) {
        case "a":
        case "Enter":
          activeCardApi.current?.add();
          break;
        case "s":
          activeCardApi.current?.toggleSave();
          break;
        case "c":
          e.preventDefault();
          setHoardOpen(true);
          break;
        case "t":
          toggleTheme();
          break;
        case "1":
          setTab("feed");
          break;
        case "2":
          setTab("streak");
          break;
        case "3":
          setTab("profile");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    helpOpen,
    hoardOpen,
    checkoutOpen,
    rewardOpen,
    bridgeOpen,
    cart.length,
    setTab,
    setHoardOpen,
    setCheckoutOpen,
    closeReward,
    dismissBridge,
    pay,
    activeCardApi,
    cart,
  ]);

  return (
    <>
      {/* Desktop hint — hidden on touch-first small screens */}
      <button
        type="button"
        onClick={() => setHelpOpen(true)}
        aria-label="Keyboard shortcuts"
        className="fixed bottom-section left-base z-nav hidden items-center gap-xs rounded-full border border-border bg-surface-elevated px-md py-sm text-xs font-medium text-mid shadow-card active:animate-pop sm:flex"
      >
        <Keyboard size={16} />
        Press <Kbd>?</Kbd> for shortcuts
      </button>

      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-xs border border-border bg-surface px-xs py-xxs font-mono text-xs font-semibold text-hi">
      {children}
    </kbd>
  );
}

function Row({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between gap-md py-xs">
      <span className="text-mid">{label}</span>
      <span className="flex items-center gap-xs">
        {keys.map((k) => (
          <Kbd key={k}>{k}</Kbd>
        ))}
      </span>
    </div>
  );
}

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-toast flex items-center justify-center p-lg">
      <button
        type="button"
        aria-label="Close shortcuts"
        onClick={onClose}
        className="absolute inset-0 h-full w-full animate-fade-in bg-black/60"
      />
      <div className="relative w-full max-w-md animate-tick rounded-xl border border-border bg-surface-elevated p-lg shadow-card">
        <div className="mb-md flex items-center justify-between">
          <h2 className="flex items-center gap-sm text-xl font-bold text-hi">
            <Keyboard size={22} /> Keyboard shortcuts
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid min-h-touch min-w-touch place-items-center rounded-full text-mid active:animate-pop"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col divide-y divide-border">
          <div className="pb-sm">
            <h3 className="mb-xs text-xs font-bold uppercase tracking-wide text-low">
              Feed
            </h3>
            <Row keys={["↑", "k"]} label="Previous craving" />
            <Row keys={["↓", "j"]} label="Next craving" />
            <Row keys={["a", "Enter"]} label="Add to hoard" />
            <Row keys={["s"]} label="Save craving" />
          </div>
          <div className="py-sm">
            <h3 className="mb-xs text-xs font-bold uppercase tracking-wide text-low">
              Navigate
            </h3>
            <Row keys={["1", "2", "3"]} label="Feed · Streak · Profile" />
            <Row keys={["c"]} label="Open cart" />
            <Row keys={["t"]} label="Toggle theme" />
          </div>
          <div className="pt-sm">
            <h3 className="mb-xs text-xs font-bold uppercase tracking-wide text-low">
              Checkout
            </h3>
            <Row keys={["Enter", "x"]} label="Cart → checkout" />
            <Row keys={["p", "Enter"]} label="Pay ₹0" />
            <Row keys={["Esc"]} label="Close / dismiss" />
            <Row keys={["?"]} label="Toggle this help" />
          </div>
        </div>
      </div>
    </div>
  );
}
