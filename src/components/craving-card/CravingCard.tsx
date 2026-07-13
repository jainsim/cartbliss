"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bookmark, Heart, Plus } from "lucide-react";
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
  const { addItem, saved, toggleSaved } = useCart();
  const [size, setSize] = useState<Size>("Regular");
  const [spice, setSpice] = useState<Spice>("Medium");
  const [toppings, setToppings] = useState<string[]>([]);
  const [price, setPrice] = useState(craving.basePrice);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);

  const isSaved = saved.includes(craving.id);

  // Melt the price down toward the floor while active.
  useEffect(() => {
    if (!active) return;
    setPrice(craving.basePrice);
    const step = Math.max(1, Math.round(craving.basePrice * 0.04));
    const id = window.setInterval(() => {
      setPrice((p) => {
        const next = p - step;
        return next <= craving.floor ? craving.floor : next;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [active, craving.basePrice, craving.floor]);

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

        {/* Melting price */}
        <div className="flex items-end gap-sm">
          <span
            key={price}
            aria-live="polite"
            className="animate-tick text-4xl font-extrabold text-gold"
          >
            {currency(price)}
          </span>
          {price < craving.basePrice && (
            <span className="pb-xs text-base text-white/50 line-through">
              {currency(craving.basePrice)}
            </span>
          )}
          <span className="pb-xs text-sm text-mint">melting… 🫠</span>
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
