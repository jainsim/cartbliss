"use client";

import React from "react";

const COLORS = ["bg-primary", "bg-gold", "bg-mango", "bg-mint", "bg-grape"];

/** Per-piece drift/rotation are driven through CSS custom properties set on the
 *  element via ref (the sanctioned "drive a CSS var" path — never a JS style
 *  string or inline color). Color comes from a reward-token utility class. */
function setPieceVars(el: HTMLSpanElement | null) {
  if (!el) return;
  const x = Math.random() * 160 - 80; // vw drift
  const y = Math.random() * 40 + 70; // vh fall
  const rot = Math.random() * 720 - 360;
  el.style.setProperty("--cf-left", `${Math.random() * 100}%`);
  el.style.setProperty("--cf-x", `${x}vw`);
  el.style.setProperty("--cf-y", `${y}vh`);
  el.style.setProperty("--cf-rot", `${rot}deg`);
  el.style.setProperty("--cf-delay", `${Math.random() * 0.25}s`);
  el.style.setProperty("--cf-dur", `${1.4 + Math.random() * 1.1}s`);
}

export default function Confetti({ count = 90 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          ref={setPieceVars}
          className={`confetti-piece ${COLORS[i % COLORS.length]}`}
        />
      ))}
    </div>
  );
}
