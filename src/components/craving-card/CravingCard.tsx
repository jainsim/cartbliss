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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);

  const isSaved = saved.includes(craving.id);

  const price = size === "Large"
    ? Math.round(craving.basePrice * 1.25)
    : craving.basePrice;

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

      <div className="craving-scrim pointer-events-none absolute inset-0 z-20" />

      <button
        type="button"
        aria-label={`Double-tap to add ${craving.name}`}
        onClick={handleTap}
        className="absolute inset-0 z-10 h-full w-full cursor-default"
      />

      {burst && (
        <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center">
          <Heart className="animate-burst fill-primary text-primary" size={128} />
        </div>
      )}

      <button
        type="button"
        onClick={() => toggleSaved(craving.id)}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from saved" : "Save craving"}
        className="absolute right-base top-xl z-30 grid min-h-touch min-w-touch place-items-center rounded-full bg-black/40 text-white backdrop-blur active:animate-pop"
      >
        <Bookmark size={20} className={isSaved ? "fill-white" : ""} />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-md p-lg pb-section">
        <div className="flex flex-col gap-xxs">
          <h2 className="text-3xl font-bold text-white">{craving.name}</h2>
          <p className="text-base text-white/80">{craving.tagline}</p>
        </div>

        <div className="text-4xl font-extrabold text-gold">
          {currency(price)}
        </div>

        <div className="flex flex-col gap-md">
          {/* Size */}
          <div className="flex flex-col gap-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">Size</span>
            <div className="flex gap-sm flex-wrap">
              {SIZES.map((s) => (
                <Chip key={s} selected={size === s} onClick={() => setSize(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          {/* Spice */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Spice Level</span>
            <div className="flex gap-xs flex-wrap">
              {SPICES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpice(s)}
                  className={
                    spice === s
                      ? "rounded-full border border-primary bg-primary/20 px-3 py-1.5 text-xs font-medium text-white active:animate-pop"
                      : "rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur active:animate-pop hover:text-white/80"
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-full border border-white/40 bg-white/10 px-base py-sm text-sm font-medium text-white backdrop-blur active:animate-pop text-left flex items-center gap-sm"
          >
            Customize Extras
            {toppings.length > 0 && (
              <span className="ml-auto inline-flex items-center justify-center w-6 h-6 bg-mint text-dark text-xs font-bold rounded-full">
                {toppings.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={doAdd}
            className="flex items-center justify-center gap-sm px-xl py-md rounded-full bg-primary text-lg font-bold text-white shadow-glow active:animate-pop"
          >
            <Plus size={22} /> ADD
          </button>
        </div>
      </div>

      {/* Toppings Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-xl font-bold">Add Extras</h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-md">
              {craving.toppings.map((t) => (
                <label key={t} className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={toppings.includes(t)}
                    onChange={() => toggleTopping(t)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-base">{t}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-lg py-md bg-primary text-white font-bold rounded-full"
            >
              Done
            </button>
          </div>
        </>
      )}
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
