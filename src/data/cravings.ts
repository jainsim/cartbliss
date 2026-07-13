// Seed catalog for the craving feed. All prices are imaginary INR integers.
// Photos are hotlinked from Unsplash (verified reachable). §8: the full-bleed
// photo carries the color, so the shell can stay minimal.

export type Size = "Regular" | "Large";
export type Spice = "Mild" | "Medium" | "Hot";

export type Craving = {
  id: string;
  name: string;
  tagline: string;
  photo: string;
  basePrice: number; // INR integer
  floor: number; // price stops melting here
  category:
    | "chaat"
    | "fried"
    | "sweet"
    | "noodles"
    | "beverage"
    | "roll"
    | "curry";
  toppings: string[]; // all ₹0 — "customize the fantasy"
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80`;

export const SIZES: Size[] = ["Regular", "Large"];
export const SPICES: Spice[] = ["Mild", "Medium", "Hot"];

export const CRAVINGS: Craving[] = [
  {
    id: "samosa",
    name: "Samosa",
    tagline: "Crispy, chatpata, 2 baje raat ko perfect 🌙",
    photo: img("photo-1601050690597-df0568f70950"),
    basePrice: 40,
    floor: 0,
    category: "fried",
    toppings: ["Extra chutney", "Chopped onion", "Sev"],
  },
  {
    id: "vada-pav",
    name: "Vada Pav",
    tagline: "Mumbai ka burger, dil se 🍔",
    photo: img("photo-1606491956689-2ea866880c84"),
    basePrice: 30,
    floor: 0,
    category: "fried",
    toppings: ["Dry garlic chutney", "Fried chilli", "Extra pav"],
  },
  {
    id: "maggi",
    name: "Midnight Maggi",
    tagline: "2-minute noodles, 2 AM feelings 🍜",
    photo: img("photo-1612929633738-8fe44f7ec841"),
    basePrice: 60,
    floor: 0,
    category: "noodles",
    toppings: ["Extra cheese", "Butter", "Fried egg", "Veggies"],
  },
  {
    id: "biryani",
    name: "Chicken Biryani",
    tagline: "Long grain, longer cravings 👑",
    photo: img("photo-1563379091339-03b21ab4a4f8"),
    basePrice: 220,
    floor: 0,
    category: "curry",
    toppings: ["Extra raita", "Boiled egg", "Salan", "Fried onion"],
  },
  {
    id: "momos",
    name: "Steamed Momos",
    tagline: "Poch-poch spicy chutney ke saath 🥟",
    photo: img("photo-1626777552726-4a6b54c97e46"),
    basePrice: 120,
    floor: 0,
    category: "fried",
    toppings: ["Schezwan chutney", "Mayo", "Extra plate"],
  },
  {
    id: "jalebi",
    name: "Hot Jalebi",
    tagline: "Meethi si, garam garam 🍯",
    photo: img("photo-1589301760014-d929f3979dbc"),
    basePrice: 80,
    floor: 0,
    category: "sweet",
    toppings: ["Rabri", "Extra syrup"],
  },
  {
    id: "chai",
    name: "Masala Chai",
    tagline: "Cutting chai fixes everything ☕",
    photo: img("photo-1571934811356-5cc061b6821f"),
    basePrice: 20,
    floor: 0,
    category: "beverage",
    toppings: ["Extra adrak", "Elaichi", "Less sugar"],
  },
  {
    id: "pani-puri",
    name: "Pani Puri",
    tagline: "Teekha, khatta, ek aur please 💦",
    photo: img("photo-1626132647523-66f5bf380027"),
    basePrice: 50,
    floor: 0,
    category: "chaat",
    toppings: ["Extra teekha paani", "Meetha", "Boondi"],
  },
  {
    id: "egg-roll",
    name: "Egg Roll",
    tagline: "Kolkata-style, rolled with love 🥚",
    photo: img("photo-1626700051175-6818013e1d4f"),
    basePrice: 90,
    floor: 0,
    category: "roll",
    toppings: ["Double egg", "Extra onion", "Green chutney"],
  },
  {
    id: "dosa",
    name: "Masala Dosa",
    tagline: "Crispy fold, aloo gold 🥔",
    photo: img("photo-1630383249896-424e482df921"),
    basePrice: 110,
    floor: 0,
    category: "curry",
    toppings: ["Extra sambar", "Coconut chutney", "Podi"],
  },
  {
    id: "kathi-roll",
    name: "Paneer Kathi Roll",
    tagline: "Wrapped-up bliss, bite by bite 🌯",
    photo: img("photo-1633945274405-b6c8069047b0"),
    basePrice: 130,
    floor: 0,
    category: "roll",
    toppings: ["Extra paneer", "Mint mayo", "Pickled onion"],
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    tagline: "Smoky, chargrilled, absolutely obsessed 🔥",
    photo: img("photo-1631452180519-c014fe946bc7"),
    basePrice: 180,
    floor: 0,
    category: "curry",
    toppings: ["Extra chutney", "Lemon", "Chaat masala"],
  },
  {
    id: "lassi",
    name: "Mango Lassi",
    tagline: "Thick, sweet, thanda thanda 🥭",
    photo: img("photo-1571091718767-18b5b1457add"),
    basePrice: 70,
    floor: 0,
    category: "beverage",
    toppings: ["Dry fruits", "Extra malai", "Kesar"],
  },
  {
    id: "hakka-noodles",
    name: "Hakka Noodles",
    tagline: "Desi-Chinese, wok-tossed magic 🥢",
    photo: img("photo-1585032226651-759b368d7246"),
    basePrice: 140,
    floor: 0,
    category: "noodles",
    toppings: ["Schezwan", "Extra veggies", "Fried garlic"],
  },
  {
    id: "fried-chicken",
    name: "Crispy Fried Chicken",
    tagline: "Crunch that echoes at midnight 🍗",
    photo: img("photo-1626645738196-c2a7c87a8f58"),
    basePrice: 199,
    floor: 0,
    category: "fried",
    toppings: ["Peri-peri", "Garlic dip", "Extra piece"],
  },
];

// Reframed as ₹0 hoard-juice (DECISIONS §2), never a real upsell.
export const PAIRINGS: Record<string, { message: string; pairWith: string }> = {
  samosa: { message: "₹0 anyway — add masala chai to the hoard? 🤑", pairWith: "chai" },
  "vada-pav": { message: "Free hoarding — grab a cutting chai too? ☕", pairWith: "chai" },
  maggi: { message: "It's all fake ₹ — add jalebi for dessert? 🍯", pairWith: "jalebi" },
  biryani: { message: "₹0 anyway — cool it down with mango lassi? 🥭", pairWith: "lassi" },
  momos: { message: "Monopoly money — add hakka noodles? 🥢", pairWith: "hakka-noodles" },
  "pani-puri": { message: "Free anyway — throw in some samosa? 🤑", pairWith: "samosa" },
  dosa: { message: "₹0 forever — add hot jalebi? 🍯", pairWith: "jalebi" },
};

export const currency = (n: number) => `₹${Math.max(0, Math.round(n))}`;
