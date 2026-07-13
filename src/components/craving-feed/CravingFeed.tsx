"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import CravingCard from "@/components/craving-card/CravingCard";
import { useCart } from "@/context/CartContext";

/** Vertical snap-scroll feed. The card at the current snap point is "active"
 *  (its price fluctuates). Reels/TikTok pattern (DESIGN-midnight.md §4), with
 *  ArrowUp/ArrowDown + k/j navigation for desktop power users. */
export default function CravingFeed() {
  const { cravings, hoardOpen, checkoutOpen, rewardOpen, bridgeOpen, tab } =
    useCart();
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [idx, setIdx] = useState(0);

  const onScroll = useCallback(() => {
    if (raf.current) return;
    raf.current = window.requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;
      const i = Math.round(el.scrollTop / el.clientHeight);
      setIdx((prev) => (prev === i ? prev : i));
    });
  }, []);

  // Keyboard feed navigation. Disabled while an overlay owns the keyboard.
  useEffect(() => {
    const overlay = hoardOpen || checkoutOpen || rewardOpen || bridgeOpen;
    const onKey = (e: KeyboardEvent) => {
      if (tab !== "feed" || overlay) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      const el = ref.current;
      if (!el) return;
      let delta = 0;
      if (e.key === "ArrowDown" || e.key === "j") delta = 1;
      else if (e.key === "ArrowUp" || e.key === "k") delta = -1;
      else return;
      e.preventDefault();
      const cur = Math.round(el.scrollTop / el.clientHeight);
      const next = Math.min(cravings.length - 1, Math.max(0, cur + delta));
      // `behavior: smooth` is cancelled by scroll-snap: mandatory; instant snap
      // is also the snappier feel for keyboard power-users.
      el.scrollTo({ top: next * el.clientHeight, behavior: "auto" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, hoardOpen, checkoutOpen, rewardOpen, bridgeOpen, cravings.length]);

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="no-scrollbar h-screen snap-y snap-mandatory overflow-y-scroll overscroll-contain"
    >
      {cravings.map((c, i) => (
        <CravingCard key={c.id} craving={c} active={i === idx} />
      ))}
    </div>
  );
}
