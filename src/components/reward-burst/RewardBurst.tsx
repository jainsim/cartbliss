"use client";

import React, { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { useCart, type Surprise } from "@/context/CartContext";
import Confetti from "@/components/reward-burst/Confetti";

/** Full-screen, sacred celebration. Confetti + streak++ + occasional surprise
 *  (non-monetary). Settles, then hands off to the affiliate bridge. */
export default function RewardBurst() {
  const { rewardOpen, surprise, closeReward, streak } = useCart();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!rewardOpen) {
      setSettled(false);
      return;
    }
    const t = window.setTimeout(() => setSettled(true), 800);
    return () => window.clearTimeout(t);
  }, [rewardOpen]);

  if (!rewardOpen) return null;

  const s = surpriseCopy(surprise);

  return (
    <div className="fixed inset-0 z-reward flex flex-col items-center justify-center gap-lg bg-bg px-lg text-center">
      <Confetti />

      <PartyPopper className="animate-burst text-primary" size={72} />

      <div className="z-reward flex animate-tick flex-col gap-sm">
        <h1 className="text-4xl font-extrabold text-hi">Delivered! 🎉</h1>
        <p className="text-lg text-mid">Craving satisfied · ₹0 spent</p>
      </div>

      {s && (
        <div className="animate-tick rounded-full bg-gold px-lg py-md text-lg font-bold text-black shadow-glow">
          {s}
        </div>
      )}

      <div className="animate-tick rounded-full border border-border bg-surface px-base py-sm text-sm font-semibold text-hi">
        🔥 {streak.count}-day craving streak
      </div>

      {settled && (
        <button
          type="button"
          onClick={closeReward}
          className="min-h-cta animate-fade-in rounded-full bg-primary px-section text-lg font-bold text-white shadow-glow active:animate-pop"
        >
          Done
        </button>
      )}
    </div>
  );
}

function surpriseCopy(s: Surprise): string | null {
  switch (s) {
    case "mystery":
      return "Mystery craving unlocked! 🎁";
    case "double":
      return "Double delivered! 🎉🎉";
    case "gold":
      return "Golden craving! ✨";
    case "streak":
      return "Streak bonus! 🔥🔥";
    default:
      return null;
  }
}
