import { base64Assets } from "./base64-assets";

export interface Product {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  tag?: string;
  category: string;
  description: string;
  stockStatus: "in_stock" | "low_stock" | "sold_out";
  colors: string[];
  details: string[];
  weight?: number; // Weight in grams
}

export const products: Product[] = [
  {
    id: "kawaii-mini-cupcakes",
    name: "Kawaii Mini Clay Cupcakes",
    price: "₹499",
    oldPrice: "₹699",
    img: base64Assets.p1,
    tag: "Sale",
    category: "Cute Stationery",
    description: "These delightful miniature clay cupcakes are handcrafted with the utmost detail. Each features pastel frosting, small sprinkles, and cute cherry or strawberry toppings. They make perfect desk decorations, props, or tiny additions to your DIY crafts.",
    stockStatus: "in_stock",
    colors: ["Pink Pastel", "Mint Green", "Lemon Yellow"],
    details: [
      "Material: Premium polymer clay",
      "Dimensions: Approximately 2cm x 2cm each",
      "Set includes: 9 unique mini cupcakes",
      "Handcrafted with love"
    ],
    weight: 250
  },
  {
    id: "kawaii-duck-organizer",
    name: "Kawaii Duck Organizer",
    price: "₹799",
    img: base64Assets.p2,
    tag: "New",
    category: "Desk Organizers",
    description: "Brighten up your study space with our Duck Organizer! Shaped like an adorable smiling duck, this sturdy organizer is perfect for keeping your pastel markers, sticky notes, scissors, and writing supplies sorted and accessible.",
    stockStatus: "in_stock",
    colors: ["Yellow"],
    details: [
      "Material: Heavy-duty, high-grade ABS plastic",
      "Dimensions: 14cm x 12cm x 10cm",
      "Features: 2 deep compartments for optimal storage",
      "Non-slip bottom design"
    ],
    weight: 800
  },
  {
    id: "kawaii-bear-pen-holder",
    name: "Kawaii Bear Pen Holder",
    price: "₹399",
    img: base64Assets.p3,
    category: "Desk Organizers",
    description: "Keep your writing tools organized inside the cutest fuzzy bear cup! Designed with an adorable teddy face and textured details, this desk accessory is highly functional and adds a perfect touch of cozy aesthetic to your workspace.",
    stockStatus: "low_stock",
    colors: ["Mint Blue", "Soft Pink"],
    details: [
      "Material: Eco-friendly resin",
      "Dimensions: 10cm height, 8cm diameter",
      "Holds up to 25 standard pens/pencils",
      "Water-resistant finish"
    ],
    weight: 500
  },
  {
    id: "kawaii-puppy-lunch-bag",
    name: "Kawaii Puppy Lunch Bag",
    price: "₹699",
    oldPrice: "₹999",
    img: base64Assets.p4,
    tag: "Sale",
    category: "Sling & School Bags",
    description: "Pack your lunch in style with our plush Puppy Lunch Bag. Featuring an insulated interior lining, it keeps your home-cooked meals warm and fresh for hours. The exterior is made of premium, ultra-soft plush fabric with embroidered puppy details.",
    stockStatus: "in_stock",
    colors: ["Lavender Purple", "Cute Pink"],
    details: [
      "Material: Velvet plush outer, food-safe thermal aluminum foil lining",
      "Dimensions: 22cm x 20cm x 13cm",
      "Closure: High-quality smooth zip",
      "Convenient top handle and adjustable shoulder strap"
    ],
    weight: 1200
  },
  {
    id: "kawaii-water-bottle",
    name: "Kawaii Water Bottle (TYESO)",
    price: "₹549",
    img: base64Assets.p5,
    category: "Bottles & Tumblers",
    description: "Our Premium TYESO Insulated Tumbler is double-walled and vacuum-insulated to keep your favorite beverages ice-cold for 24 hours or steaming hot for 12 hours. Features a secure spill-proof lid with an integrated carrying handle.",
    stockStatus: "sold_out",
    colors: ["Teal", "Orange"],
    details: [
      "Material: 18/8 Food-grade stainless steel, BPA-free plastic lid",
      "Capacity: 600ml / 20oz",
      "Insulation: Double-walled vacuum lock technology",
      "Sweat-proof exterior coating"
    ],
    weight: 950
  },
  {
    id: "aesthetic-sticker-pack",
    name: "Aesthetic Sticker Pack",
    price: "₹199",
    img: base64Assets.p6,
    category: "Journal Supplies",
    description: "A handpicked set of adorable stickers to decorate your journals, bullet planners, phone cases, and laptops. Features cute animals, bubble teas, flowers, and positive quotes in beautiful pastel themes.",
    stockStatus: "in_stock",
    colors: ["Pastel Mix"],
    details: [
      "Includes: 40 unique die-cut stickers",
      "Material: Waterproof, matte-finish vinyl",
      "No residue left when removed",
      "Perfect for scrapbooking and journaling"
    ],
    weight: 50
  },
  {
    id: "girly-hearts-stickers",
    name: "Girly Hearts Stickers",
    price: "₹299",
    img: base64Assets.p7,
    category: "Journal Supplies",
    description: "Add a touch of glittery sparkle to your notebooks with these holographic heart sticker sheets. Each pack contains a variety of shapes, borders, and ribbon stickers that shimmer under the light.",
    stockStatus: "in_stock",
    colors: ["Holographic Pink", "Holographic Lilac"],
    details: [
      "Includes: 5 sticker sheets per pack",
      "Material: Glossy holographic PET film",
      "Precision die-cut details",
      "Acid-free, safe for long-term scrapbook storage"
    ],
    weight: 50
  },
  {
    id: "lavender-journal-kit",
    name: "Lavender Journal Kit",
    price: "₹599",
    img: base64Assets.p8,
    category: "Journal Supplies",
    description: "Unlock your creativity with this all-in-one Lavender Journal Kit. Carefully curated for bullet journaling enthusiasts, it includes a premium dot-grid notebook and matching pastel purple accessories to start writing right away.",
    stockStatus: "in_stock",
    colors: ["Lavender"],
    details: [
      "Kit includes: 1 A5 Dot-Grid Notebook (160 pages, 100gsm ink-proof paper)",
      "Accessories: 4 rolls of washi tape, 2 sticker sheets, 1 pastel violet gel pen",
      "Beautifully packaged in a gift box",
      "Ideal gift for stationery lovers"
    ],
    weight: 1100
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function calculateShippingCost(totalWeightGrams: number): number {
  if (totalWeightGrams <= 0) return 0;

  // Round up to the nearest multiple of 500g
  let wRounded = Math.ceil(totalWeightGrams / 500) * 500;
  if (wRounded < 500) {
    wRounded = 500;
  }

  if (wRounded <= 5000) {
    // Up to 5kg: starts at 42.48 for 500g, +18.88 for each additional 500g
    return parseFloat((42.48 + 18.88 * ((wRounded - 500) / 500)).toFixed(2));
  } else {
    // Above 5kg: jump to 237.18 at 5.5kg (5500g), then +18.88 for each additional 500g
    return parseFloat((237.18 + 18.88 * ((wRounded - 5500) / 500)).toFixed(2));
  }
}
