"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bookmark, Heart, Plus, TrendingDown, TrendingUp } from "lucide-react";
import {
  SIZES,
  SPICES,
  currency,
  type Craving,
  type Size,
  type Spice,
} from "@/data/cravings";
import { useCart } from "@/context/CartContext";

/** One full-bleed craving. Price melts down toward ₹0 while this card is the
 *  active one in the feed (DECISIONS §3). Double-tap anywhere = add. */
export default function CravingCard({
  craving,
  active,
}: {
  craving: Craving;
  active: boolean;
}) {
  const { addItem, saved, toggleSaved, activeCardApi } = useCart();
  const [size, setSize] = useState<Size>("Regular");
  const [spice, setSpice] = useState<Spice>("Medium");
  const [toppings, setToppings] = useState<string[]>([]);
  const [price, setPrice] = useState(craving.basePrice);
  const [dir, setDir] = useState<"up" | "down">("down");
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);

  const isSaved = saved.includes(craving.id);

  // Live price: a bounded random walk around basePrice while active. Swings both
  // ways within a realistic band, never zero (DECISIONS §3, revised).
  useEffect(() => {
    if (!active) return;
    setPrice(craving.basePrice);
    setDir("down");
    const low = Math.max(1, Math.round(craving.basePrice * 0.88));
    const high = Math.round(craving.basePrice * 1.12);
    const maxStep = Math.max(2, Math.round(craving.basePrice * 0.05));
    const id = window.setInterval(() => {
      setPrice((p) => {
        // Always move at least ₹1, either direction, within the band.
        let delta = Math.round((Math.random() * 2 - 1) * maxStep);
        if (delta === 0) delta = Math.random() < 0.5 ? -1 : 1;
        let next = p + delta;
        if (next < low) next = low;
        if (next > high) next = high;
        if (next === p) next = p === high ? p - 1 : p + 1; // avoid stalling at a bound
        setDir(next > p ? "up" : "down");
        return next;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, [active, craving.basePrice]);

  const toggleTopping = (t: string) =>
    setToppings((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const doAdd = () => {
    addItem({
      id: craving.id,
      name: craving.name,
      photo: craving.photo,
      price,
      size,
      spice,
      toppings,
    });
  };

  // Expose the current card's actions to keyboard shortcuts while it's active.
  // A ref keeps `add` pointed at the latest price/selection without re-registering.
  const doAddRef = useRef(doAdd);
  doAddRef.current = doAdd;
  useEffect(() => {
    if (!active) return;
    const api = {
      add: () => doAddRef.current(),
      toggleSave: () => toggleSaved(craving.id),
    };
    activeCardApi.current = api;
    return () => {
      if (activeCardApi.current === api) activeCardApi.current = null;
    };
  }, [active, craving.id, activeCardApi, toggleSaved]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setBurst(true);
      doAdd();
      window.setTimeout(() => setBurst(false), 700);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  return (
    <section className="relative h-screen w-full snap-start overflow-hidden bg-black">
      <Image
        src={craving.photo}
        alt={craving.name}
        fill
        sizes="100vw"
        className="object-cover"
        priority={active}
      />

      {/* Double-tap catcher */}
      <button
        type="button"
        aria-label={`Double-tap to add ${craving.name}`}
        onClick={handleTap}
        className="absolute inset-0 z-10 h-full w-full cursor-default"
      />

      {/* Legibility scrim */}
      <div className="craving-scrim pointer-events-none absolute inset-0 z-20" />

      {/* Double-tap heart burst */}
      {burst && (
        <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center">
          <Heart className="animate-burst fill-primary text-primary" size={128} />
        </div>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={() => toggleSaved(craving.id)}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from saved" : "Save craving"}
        className="absolute right-base top-xl z-30 grid min-h-touch min-w-touch place-items-center rounded-full bg-black/40 text-white backdrop-blur active:animate-pop"
      >
        <Bookmark size={20} className={isSaved ? "fill-white" : ""} />
      </button>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-md p-lg pb-section">
        <div className="flex flex-col gap-xxs">
          <h2 className="text-3xl font-bold text-white">{craving.name}</h2>
          <p className="text-base text-white/80">{craving.tagline}</p>
        </div>

        {/* Live fluctuating price — swings within a band, never zero */}
        <div className="flex items-end gap-sm">
          <span
            key={price}
            aria-live="polite"
            className="animate-tick text-4xl font-extrabold text-gold"
          >
            {currency(price)}
          </span>
          <span
            className={
              dir === "up"
                ? "flex items-center gap-xxs pb-xs text-sm font-semibold text-primary"
                : "flex items-center gap-xxs pb-xs text-sm font-semibold text-mint"
            }
          >
            {dir === "up" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            live price
          </span>
        </div>

        {/* Size */}
        <div className="flex flex-wrap gap-sm">
          {SIZES.map((s) => (
            <Chip key={s} selected={size === s} onClick={() => setSize(s)}>
              {s}
            </Chip>
          ))}
          {SPICES.map((s) => (
            <Chip key={s} selected={spice === s} onClick={() => setSpice(s)}>
              {s}
            </Chip>
          ))}
        </div>

        {/* Toppings (all ₹0) */}
        <div className="flex flex-wrap gap-sm">
          {craving.toppings.map((t) => (
            <Chip
              key={t}
              selected={toppings.includes(t)}
              onClick={() => toggleTopping(t)}
            >
              + {t}
            </Chip>
          ))}
        </div>

        {/* Add */}
        <button
          type="button"
          onClick={doAdd}
          className="flex min-h-cta items-center justify-center gap-sm rounded-full bg-primary text-lg font-bold text-white shadow-glow active:animate-pop"
        >
          <Plus size={22} /> Add — {currency(price)}
        </button>
      </div>
    </section>
  );
}

function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        selected
          ? "rounded-full border border-primary bg-primary px-base py-sm text-sm font-semibold text-white active:animate-pop"
          : "rounded-full border border-white/40 bg-white/10 px-base py-sm text-sm font-medium text-white backdrop-blur active:animate-pop"
      }
    >
      {children}
    </button>
  );
}
