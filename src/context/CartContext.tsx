"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CRAVINGS, PAIRINGS, type Size, type Spice } from "@/data/cravings";

/* ------------------------------------------------------------------ types */

export interface CartItem {
  cartId: string; // id + size + spice + sorted toppings
  id: string;
  name: string;
  photo: string;
  price: number; // INR integer
  quantity: number;
  size: Size;
  spice: Spice;
  toppings: string[];
}

export type AddPayload = {
  id: string;
  name: string;
  photo: string;
  price: number;
  size: Size;
  spice: Spice;
  toppings: string[];
};

export type Surprise = null | "mystery" | "double" | "gold" | "streak";

export type Tab = "feed" | "streak" | "profile";

// Imperative handle the active craving-card registers so keyboard shortcuts can
// act on it with its live price + current customization.
export type CardApi = { add: () => void; toggleSave: () => void };

interface Streak {
  count: number;
  lastHit: string | null; // ISO date (YYYY-MM-DD)
  freezeUsed: boolean;
}

interface Toast {
  id: number;
  message: string;
}

interface AppState {
  // catalog
  cravings: typeof CRAVINGS;
  // active tab (lifted so keyboard shortcuts can switch it)
  tab: Tab;
  setTab: (t: Tab) => void;
  // the focused craving-card's imperative handle (add / save)
  activeCardApi: React.MutableRefObject<CardApi | null>;
  // cart / hoard
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addItem: (payload: AddPayload) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  // sheets / flow
  hoardOpen: boolean;
  setHoardOpen: (v: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (v: boolean) => void;
  rewardOpen: boolean;
  surprise: Surprise;
  bridgeOpen: boolean;
  setBridgeOpen: (v: boolean) => void;
  pay: () => void; // checkout -> reward
  closeReward: () => void; // reward -> bridge
  dismissBridge: () => void;
  // pairing (₹0 hoard-juice)
  pairing: { message: string; pairWith: string } | null;
  clearPairing: () => void;
  // streak
  streak: Streak;
  // saved cravings (rehomed wishlist)
  saved: string[];
  toggleSaved: (id: string) => void;
  // toasts
  toasts: Toast[];
  pushToast: (message: string) => void;
}

const Ctx = createContext<AppState | undefined>(undefined);

/* -------------------------------------------------------------- helpers */

const LS = {
  streak: "cartbliss-streak",
  saved: "cartbliss-saved",
  affiliate: "cartbliss-affiliate",
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(toISO + "T00:00:00");
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage disabled — session-only is acceptable */
  }
}

/* ------------------------------------------------------------- provider */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]); // not persisted (resets each session)
  const [hoardOpen, setHoardOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [surprise, setSurprise] = useState<Surprise>(null);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [pairing, setPairing] = useState<AppState["pairing"]>(null);
  const [streak, setStreak] = useState<Streak>({
    count: 0,
    lastHit: null,
    freezeUsed: false,
  });
  const [saved, setSaved] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tab, setTab] = useState<Tab>("feed");
  const activeCardApi = useRef<CardApi | null>(null);

  // Hydrate persisted state after mount (avoids SSR mismatch).
  useEffect(() => {
    setStreak(
      readJSON<Streak>(LS.streak, { count: 0, lastHit: null, freezeUsed: false }),
    );
    setSaved(readJSON<string[]>(LS.saved, []));
  }, []);

  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);
  const cartTotal = cart.reduce((n, i) => n + i.price * i.quantity, 0);

  const pushToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  const addItem = useCallback(
    (p: AddPayload) => {
      const cartId = `${p.id}-${p.size}-${p.spice}-${[...p.toppings]
        .sort()
        .join(",")}`;
      setCart((prev) => {
        const existing = prev.find((i) => i.cartId === cartId);
        if (existing) {
          return prev.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { ...p, cartId, quantity: 1 }];
      });
      pushToast("Added! Total: monopoly money 🤑");
      const pair = PAIRINGS[p.id];
      if (pair) {
        window.setTimeout(() => setPairing(pair), 1200);
      }
    },
    [pushToast],
  );

  const removeItem = useCallback((cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback(
    (cartId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(cartId);
        return;
      }
      setCart((prev) =>
        prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i)),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => setCart([]), []);
  const clearPairing = useCallback(() => setPairing(null), []);

  // Streak: consecutive = +1; exactly one missed night = grace freeze; more = reset.
  const registerStreakHit = useCallback(() => {
    setStreak((prev) => {
      const today = todayISO();
      let next: Streak;
      if (prev.lastHit === null) {
        next = { count: 1, lastHit: today, freezeUsed: false };
      } else {
        const gap = dayDiff(prev.lastHit, today);
        if (gap === 0) {
          next = prev; // already hit today
        } else if (gap === 1) {
          next = { count: prev.count + 1, lastHit: today, freezeUsed: false };
        } else if (gap === 2 && !prev.freezeUsed) {
          next = { count: prev.count + 1, lastHit: today, freezeUsed: true };
        } else {
          next = { count: 1, lastHit: today, freezeUsed: false };
        }
      }
      writeJSON(LS.streak, next);
      return next;
    });
  }, []);

  const rollSurprise = useCallback((): Surprise => {
    if (Math.random() > 0.25) return null; // ~1-in-4
    const pool: Exclude<Surprise, null>[] = [
      "mystery",
      "double",
      "gold",
      "streak",
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const pay = useCallback(() => {
    setCheckoutOpen(false);
    setHoardOpen(false);
    setSurprise(rollSurprise());
    registerStreakHit();
    setRewardOpen(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 30, 80]);
    }
  }, [registerStreakHit, rollSurprise]);

  // Reward settles -> hand off to the cooling-off bridge (unless suppressed).
  const closeReward = useCallback(() => {
    setRewardOpen(false);
    clearCart();
    const aff = readJSON<{ suppressSessions: number }>(LS.affiliate, {
      suppressSessions: 0,
    });
    if (aff.suppressSessions > 0) {
      writeJSON(LS.affiliate, {
        suppressSessions: aff.suppressSessions - 1,
      });
      return;
    }
    setBridgeOpen(true);
  }, [clearCart]);

  const dismissBridge = useCallback(() => {
    setBridgeOpen(false);
    writeJSON(LS.affiliate, { suppressSessions: 2 }); // suppress next 2 sessions
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      writeJSON(LS.saved, next);
      return next;
    });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      cravings: CRAVINGS,
      tab,
      setTab,
      activeCardApi,
      cart,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      hoardOpen,
      setHoardOpen,
      checkoutOpen,
      setCheckoutOpen,
      rewardOpen,
      surprise,
      bridgeOpen,
      setBridgeOpen,
      pay,
      closeReward,
      dismissBridge,
      pairing,
      clearPairing,
      streak,
      saved,
      toggleSaved,
      toasts,
      pushToast,
    }),
    [
      tab,
      cart,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      hoardOpen,
      checkoutOpen,
      rewardOpen,
      surprise,
      bridgeOpen,
      pay,
      closeReward,
      dismissBridge,
      pairing,
      clearPairing,
      streak,
      saved,
      toggleSaved,
      toasts,
      pushToast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = (): AppState => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
