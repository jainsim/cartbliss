"use client";

import React, { useCallback, useRef, useState } from "react";
import CravingCard from "@/components/craving-card/CravingCard";
import { useCart } from "@/context/CartContext";

/** Vertical snap-scroll feed. The card at the current snap point is "active"
 *  (its price melts). Reels/TikTok pattern (DESIGN-midnight.md §4). */
export default function CravingFeed() {
  const { cravings } = useCart();
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
