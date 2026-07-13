"use client";

import React from "react";
import Image from "next/image";
import { Bookmark, Moon, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle/ThemeToggle";
import { currency } from "@/data/cravings";
import { useCart } from "@/context/CartContext";

/** Profile tab. Rehomed wishlist = "Saved cravings" (DECISIONS §1). */
export default function ProfileView() {
  const { cravings, saved, toggleSaved, addItem } = useCart();
  const savedCravings = cravings.filter((c) => saved.includes(c.id));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-xl px-lg pb-section pt-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-md">
          <div className="grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
            <Moon size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-hi">Midnight snacker</span>
            <span className="text-sm text-mid">Craving connoisseur 🌙</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <section className="flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <Bookmark className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-hi">Saved cravings</h2>
        </div>

        {savedCravings.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface p-lg text-center text-mid">
            No saved cravings yet. Tap the 🔖 on any craving to stash it.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-md">
            {savedCravings.map((c) => (
              <li
                key={c.id}
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={c.photo}
                    alt={c.name}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSaved(c.id)}
                    aria-label="Remove from saved"
                    className="absolute right-sm top-sm grid min-h-touch min-w-touch place-items-center rounded-full bg-black/40 text-white active:animate-pop"
                  >
                    <Bookmark size={18} className="fill-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-sm p-md">
                  <span className="truncate text-sm font-semibold text-hi">
                    {c.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: c.id,
                        name: c.name,
                        photo: c.photo,
                        price: c.basePrice,
                        size: "Regular",
                        spice: "Medium",
                        toppings: [],
                      })
                    }
                    className="shrink-0 rounded-full bg-primary px-md py-xs text-xs font-bold text-white active:animate-pop"
                  >
                    Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-auto flex items-center justify-center gap-xs text-center text-xs text-low">
        <ShieldCheck size={14} /> {currency(0)} spent, always. No real money moves.
      </p>
    </div>
  );
}
