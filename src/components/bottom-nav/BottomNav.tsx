"use client";

import React from "react";
import { Flame, Home, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Bottom tab bar (thumb zone). Cart is not a view — it opens the hoard sheet
 *  (DECISIONS §3). Tab state is lifted to context so keyboard shortcuts share it. */
export default function BottomNav() {
  const { cartCount, setHoardOpen, streak, tab, setTab } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-nav flex items-stretch justify-around border-t border-border bg-surface-elevated pb-xs">
      <NavItem
        label="Feed"
        active={tab === "feed"}
        onClick={() => setTab("feed")}
      >
        <Home size={22} />
      </NavItem>

      <NavItem label="Cart" active={false} onClick={() => setHoardOpen(true)}>
        <span className="relative">
          <ShoppingBag size={22} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-primary text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </span>
      </NavItem>

      <NavItem
        label="Streak"
        active={tab === "streak"}
        onClick={() => setTab("streak")}
      >
        <span className="relative">
          <Flame size={22} />
          {streak.count > 0 && (
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-mango text-xs font-bold text-black">
              {streak.count}
            </span>
          )}
        </span>
      </NavItem>

      <NavItem
        label="Profile"
        active={tab === "profile"}
        onClick={() => setTab("profile")}
      >
        <User size={22} />
      </NavItem>
    </nav>
  );
}

function NavItem({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active}
      className={
        active
          ? "flex min-h-touch flex-1 flex-col items-center justify-center gap-xxs py-sm text-primary active:animate-pop"
          : "flex min-h-touch flex-1 flex-col items-center justify-center gap-xxs py-sm text-mid active:animate-pop"
      }
    >
      {children}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
