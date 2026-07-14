import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tokens.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "chaska — order the craving, skip the bill",
  description:
    "Bhookh lagi? 🌙 A dopamine food-ordering fantasy. Hoard desi snacks, check out for ₹0, get the reward. No real money moves.",
};

// Runs before first paint: apply the persisted theme so there's no light->dark flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem('cartbliss-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased text-hi bg-bg select-none`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
