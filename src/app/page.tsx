"use client";

import React from "react";
import CravingFeed from "@/components/craving-feed/CravingFeed";
import BottomNav from "@/components/bottom-nav/BottomNav";
import StreakView from "@/components/daily-craving-streak/StreakView";
import ProfileView from "@/components/profile/ProfileView";
import CartHoardSheet from "@/components/cart-hoard-sheet/CartHoardSheet";
import CheckoutOneshot from "@/components/checkout-oneshot/CheckoutOneshot";
import RewardBurst from "@/components/reward-burst/RewardBurst";
import AffiliateBridge from "@/components/affiliate-bridge/AffiliateBridge";
import ToastStack from "@/components/toast/ToastStack";
import KeyboardShortcuts from "@/components/keyboard-shortcuts/KeyboardShortcuts";
import { useCart } from "@/context/CartContext";

export default function Home() {
  const { tab } = useCart();

  return (
    <>
      <main className="relative">
        {tab === "feed" && (
          <>
            {/* Top brand bar over the feed */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-lg pb-xl">
              <span className="text-lg font-extrabold text-white">
                cartbliss 🌙
              </span>
              <span className="text-sm font-medium text-white/80">
                double-tap to add 🤤
              </span>
            </div>
            <CravingFeed />
          </>
        )}
        {tab === "streak" && <StreakView />}
        {tab === "profile" && <ProfileView />}
      </main>

      <BottomNav />

      {/* Overlays */}
      <CartHoardSheet />
      <CheckoutOneshot />
      <RewardBurst />
      <AffiliateBridge />
      <ToastStack />
      <KeyboardShortcuts />
    </>
  );
}
