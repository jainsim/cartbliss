"use client";

import React from "react";
import { Flame, Snowflake } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Retention loop. One-night grace freeze so a single miss doesn't break it
 *  (DECISIONS §4) — no bedtime guilt. */
export default function StreakView() {
  const { streak } = useCart();
  const hasStreak = streak.count > 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-xl px-lg pb-section pt-section">
      <div className="flex flex-col items-center gap-md">
        <div className="grid size-32 place-items-center rounded-full bg-mango/15">
          <Flame className="text-mango" size={72} />
        </div>
        <span className="text-6xl font-extrabold text-hi">{streak.count}</span>
        <p className="text-center text-lg text-mid">
          {hasStreak
            ? `${streak.count}-day craving streak 🔥 Don't break it tonight`
            : "No streak yet. Order a craving tonight to start 🔥"}
        </p>
      </div>

      <div className="flex items-center gap-md rounded-lg border border-border bg-surface p-lg">
        <Snowflake className="shrink-0 text-grape" size={28} />
        <div className="flex flex-col">
          <span className="font-semibold text-hi">
            {streak.freezeUsed ? "Freeze used 🧊" : "1 free freeze ready 🧊"}
          </span>
          <span className="text-sm text-mid">
            {streak.freezeUsed
              ? "Streak's safe once — hit it tonight to keep going."
              : "Miss one night and we've got you. Miss two and it resets."}
          </span>
        </div>
      </div>
    </div>
  );
}
