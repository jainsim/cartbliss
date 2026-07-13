"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Sparkles, X } from "lucide-react";
import { currency } from "@/data/cravings";
import { useCart } from "@/context/CartContext";

/** Bottom sheet. Big climbing total with "monopoly money" framing. The in-cart
 *  pairing prompt is ₹0 hoard-juice, never a real upsell (DECISIONS §2). */
export default function CartHoardSheet() {
  const {
    hoardOpen,
    setHoardOpen,
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    setCheckoutOpen,
    pairing,
    clearPairing,
    addItem,
    cravings,
  } = useCart();

  if (!hoardOpen) return null;

  const addPairing = () => {
    if (!pairing) return;
    const c = cravings.find((x) => x.id === pairing.pairWith);
    if (c) {
      addItem({
        id: c.id,
        name: c.name,
        photo: c.photo,
        price: 0,
        size: "Regular",
        spice: "Medium",
        toppings: [],
      });
    }
    clearPairing();
  };

  return (
    <div className="fixed inset-0 z-sheet">
      <button
        type="button"
        aria-label="Close hoard"
        onClick={() => setHoardOpen(false)}
        className="absolute inset-0 h-full w-full animate-fade-in bg-black/50"
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-sheet animate-sheet-up flex-col rounded-t-xl border-t border-border bg-surface-elevated shadow-card">
        {/* Handle + header */}
        <div className="flex flex-col gap-md px-lg pb-sm pt-md">
          <div className="mx-auto h-1 w-12 rounded-full bg-border" />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-hi">
              Your hoard 🛒{" "}
              <span className="text-mid">({cartCount})</span>
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setHoardOpen(false)}
              className="grid min-h-touch min-w-touch place-items-center rounded-full text-mid active:animate-pop"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Pairing prompt */}
        {pairing && cart.length > 0 && (
          <div className="mx-lg mb-sm flex items-center gap-md rounded-lg border border-border bg-surface p-md">
            <Sparkles className="shrink-0 text-mango" size={20} />
            <p className="flex-1 text-sm text-hi">{pairing.message}</p>
            <button
              type="button"
              onClick={addPairing}
              className="rounded-full bg-mango px-base py-sm text-sm font-bold text-black active:animate-pop"
            >
              Add
            </button>
            <button
              type="button"
              aria-label="Dismiss suggestion"
              onClick={clearPairing}
              className="text-mid active:animate-pop"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Items */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-lg">
          {cart.length === 0 ? (
            <p className="py-section text-center text-mid">
              Cart khaali hai. Start hoarding →
            </p>
          ) : (
            <ul className="flex flex-col gap-md py-sm">
              {cart.map((item) => (
                <li key={item.cartId} className="flex items-center gap-md">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-hi">
                      {item.name}
                    </span>
                    <span className="truncate text-xs text-mid">
                      {item.size} · {item.spice}
                      {item.toppings.length > 0
                        ? ` · +${item.toppings.length}`
                        : ""}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {currency(item.price * item.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() =>
                        updateQuantity(item.cartId, item.quantity - 1)
                      }
                      className="grid size-11 place-items-center rounded-full border border-border text-hi active:animate-pop"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-5 text-center font-semibold text-hi">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() =>
                        updateQuantity(item.cartId, item.quantity + 1)
                      }
                      className="grid size-11 place-items-center rounded-full border border-border text-hi active:animate-pop"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total + checkout */}
        <div className="flex flex-col gap-sm border-t border-border p-lg">
          <div className="flex items-baseline justify-between">
            <span className="text-mid">Total · monopoly money 🤑</span>
            <span key={cartTotal} className="animate-tick text-3xl font-extrabold text-hi">
              {currency(cartTotal)}
            </span>
          </div>
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => setCheckoutOpen(true)}
            className="min-h-cta rounded-full bg-primary text-lg font-bold text-white shadow-glow active:animate-pop disabled:opacity-40"
          >
            Checkout ₹0 →
          </button>
        </div>
      </div>
    </div>
  );
}
