import React, { useState } from "react";
import { Home, Search, LayoutGrid, ShoppingCart, User, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileNav() {
  const { cartCount, openCart, isCartOpen } = useCart();
  const { products } = useProducts();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === "/";
  const isShopActive = location.pathname === "/products";

  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState("");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileName, setProfileName] = useState(() => {
    try {
      const stored = localStorage.getItem("hapyezta-profile");
      if (stored) return JSON.parse(stored).name || "Ananya Sharma";
    } catch {}
    return "Ananya Sharma";
  });
  const [profileEmoji, setProfileEmoji] = useState(() => {
    try {
      const stored = localStorage.getItem("hapyezta-profile");
      if (stored) return JSON.parse(stored).emoji || "🌸";
    } catch {}
    return "🌸";
  });
  const [profileEmail, setProfileEmail] = useState(() => {
    try {
      const stored = localStorage.getItem("hapyezta-profile");
      if (stored) return JSON.parse(stored).email || "ananya@kawaii.com";
    } catch {}
    return "ananya@kawaii.com";
  });
  const [profilePhone, setProfilePhone] = useState(() => {
    try {
      const stored = localStorage.getItem("hapyezta-profile");
      if (stored) return JSON.parse(stored).phone || "+91 98765 43210";
    } catch {}
    return "+91 98765 43210";
  });

  const [editName, setEditName] = useState(profileName);
  const [editEmoji, setEditEmoji] = useState(profileEmoji);
  const [editEmail, setEditEmail] = useState(profileEmail);
  const [editPhone, setEditPhone] = useState(profilePhone);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileName(editName);
    setProfileEmoji(editEmoji);
    setProfileEmail(editEmail);
    setProfilePhone(editPhone);

    localStorage.setItem(
      "hapyezta-profile",
      JSON.stringify({
        name: editName,
        emoji: editEmoji,
        email: editEmail,
        phone: editPhone,
      })
    );

    setIsSettingsOpen(false);
    alert("Profile settings saved successfully! 🌸");
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackingResult(null);

    if (!trackOrderId.trim()) {
      setTrackError("Please enter a valid Order ID! 🌸");
      return;
    }

    try {
      const stored = localStorage.getItem("hapyezta-orders");
      if (stored) {
        const orders = JSON.parse(stored);
        const matched = orders.find(
          (o: any) => o.id.trim().toLowerCase() === trackOrderId.trim().toLowerCase()
        );
        if (matched) {
          setTrackingResult(matched);
        } else {
          setTrackError("No order found with this ID. 😿 Please check spelling!");
        }
      } else {
        setTrackError("No orders placed on this device yet! 🌸");
      }
    } catch (err) {
      console.error(err);
      setTrackError("Something went wrong. Please try again!");
    }
  };

  // Search logic
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleTabClick = (tab: string) => {
    if (tab === "home") {
      navigate({ to: "/" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "shop") {
      navigate({ to: "/products" });
    } else if (tab === "search") {
      setIsSearchOpen(true);
    } else if (tab === "cart") {
      openCart();
    } else if (tab === "account") {
      setIsAccountOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-coral/10 shadow-[0_-8px_24px_rgba(242,108,88,0.08)] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Home */}
          <button
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative cursor-pointer ${
              isHomeActive
                ? "text-coral scale-105 font-bold"
                : "text-coral/70 hover:text-coral"
            }`}
          >
            <Home className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-0.5 font-body">Home</span>
            {isHomeActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral animate-ping" />
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => handleTabClick("search")}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative cursor-pointer ${
              isSearchOpen
                ? "text-coral scale-105 font-bold"
                : "text-coral/70 hover:text-coral"
            }`}
          >
            <Search className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-0.5 font-body">Search</span>
            {isSearchOpen && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral" />
            )}
          </button>

          {/* Shop */}
          <button
            onClick={() => handleTabClick("shop")}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative cursor-pointer ${
              isShopActive
                ? "text-coral scale-105 font-bold"
                : "text-coral/70 hover:text-coral"
            }`}
          >
            <LayoutGrid className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-0.5 font-body">Shop</span>
            {isShopActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral" />
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => handleTabClick("cart")}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative cursor-pointer ${
              isCartOpen
                ? "text-coral scale-105 font-bold"
                : "text-coral/70 hover:text-coral"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-[22px] h-[22px] stroke-[2.2]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-coral text-white text-[9px] font-bold w-4 h-4 rounded-full grid place-items-center border border-white animate-fade-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold mt-0.5 font-body">cart</span>
            {isCartOpen && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral" />
            )}
          </button>

          {/* Account */}
          <button
            onClick={() => handleTabClick("account")}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative cursor-pointer ${
              isAccountOpen
                ? "text-coral scale-105 font-bold"
                : "text-coral/70 hover:text-coral"
            }`}
          >
            <User className="w-[22px] h-[22px] stroke-[2.2]" />
            <span className="text-[11px] font-semibold mt-0.5 font-body">account</span>
            {isAccountOpen && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-coral" />
            )}
          </button>
        </div>
      </div>

      {/* --- Search Dialog --- */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="w-[92vw] sm:max-w-[425px] rounded-[2rem] sm:rounded-3xl p-6 bg-cream border-2 border-yellow/30 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="font-display text-2xl text-purple flex items-center gap-2">
              🔍 Search Kawaii Items
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pens, journals, boxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white border-2 border-purple/20 focus:border-coral outline-none text-foreground font-body text-sm transition-colors"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-purple/40" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 w-5 h-5 rounded-full bg-purple/10 flex items-center justify-center hover:bg-purple/20 transition cursor-pointer"
                >
                  <X className="w-3 h-3 text-purple" />
                </button>
              )}
            </div>

            {/* Popular tags */}
            {!searchQuery && (
              <div>
                <div className="text-xs font-semibold text-purple/60 mb-2 uppercase tracking-wider">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Journal", "Stickers", "Water Bottle", "Organizer", "Lunch Box"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-purple/15 text-xs text-purple font-semibold hover:bg-coral hover:text-white hover:border-transparent transition cursor-pointer"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-purple/60 uppercase tracking-wider">
                  Search Results ({filteredProducts.length})
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="space-y-2.5">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white rounded-2xl flex items-center justify-between border border-purple/10 hover:border-coral/30 transition-all shadow-sm"
                      >
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs text-foreground line-clamp-1">
                              {p.name}
                            </h4>
                            {p.tag && (
                              <span className="text-[8px] bg-coral text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                                {p.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                            {p.description}
                          </p>
                          <span className="text-xs font-bold text-purple mt-1 block">
                            {p.price}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            addToCart({
                              id: p.id,
                              name: p.name,
                              price: parseFloat(p.price.replace(/[^\d.]/g, "")),
                              priceString: p.price,
                              img: p.img,
                            });
                            setIsSearchOpen(false);
                            openCart();
                          }}
                          className="px-3 py-1.5 rounded-full bg-purple text-white text-xs font-semibold hover:bg-coral transition cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-purple/20">
                    <p className="text-sm text-muted-foreground">
                      No cute items found for "{searchQuery}" 😿
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-3 text-xs text-coral font-bold hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Cart Drawer is mounted in __root.tsx, no separate Sheet is needed here */}

      {/* --- Account Dialog --- */}
      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <DialogContent className="w-[92vw] sm:max-w-[400px] rounded-[2rem] sm:rounded-3xl p-6 bg-cream border-2 border-yellow/30 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="font-display text-2xl text-purple text-center">
              ✨ Kawaii Club Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl p-5 border border-purple/10 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-coral to-purple grid place-items-center text-3xl mb-3 border-4 border-cream shadow-md select-none animate-bounce">
                {profileEmoji}
              </div>
              <h3 className="font-display text-lg text-purple font-semibold">
                {profileName}
              </h3>
              <p className="text-xs text-muted-foreground">Member since May 2026</p>

              {/* VIP tag */}
              <div className="inline-flex items-center gap-1.5 bg-yellow/30 text-purple text-[10px] font-bold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">
                👑 Sparkle VIP Member
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-purple/5">
                <div>
                  <span className="block font-display text-base text-coral">₹4,250</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Saved</span>
                </div>
                <div>
                  <span className="block font-display text-base text-teal">6 Orders</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Placed</span>
                </div>
              </div>
            </div>

            {/* Account settings / links */}
            <div className="bg-white rounded-2xl p-2.5 border border-purple/10 shadow-sm space-y-1 text-sm">
              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  setIsTrackOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-cream hover:text-coral transition font-semibold text-purple cursor-pointer border-none bg-transparent"
              >
                📦 Track My Orders
              </button>

              <button
                onClick={() => {
                  setEditName(profileName);
                  setEditEmoji(profileEmoji);
                  setEditEmail(profileEmail);
                  setEditPhone(profilePhone);
                  setIsAccountOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-cream hover:text-coral transition font-semibold text-purple cursor-pointer border-none bg-transparent"
              >
                ⚙️ Account Settings
              </button>
              <button
                onClick={() => {
                  alert("Logged out successfully.");
                  setIsAccountOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-semibold text-red-400 cursor-pointer border-none bg-transparent"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Track Order Modal */}
      {isTrackOpen && (
        <Dialog open={isTrackOpen} onOpenChange={(open) => {
          if (!open) {
            setIsTrackOpen(false);
            setTrackOrderId("");
            setTrackingResult(null);
            setTrackError("");
          }
        }}>
          <DialogContent className="w-[92vw] sm:max-w-[480px] rounded-[2rem] sm:rounded-3xl p-6 sm:p-8 bg-white border-2 border-yellow/20 shadow-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-2">
              <DialogTitle className="font-display text-2xl text-purple flex items-center gap-2">
                📦 Track Your Order
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-foreground/60 mb-4 font-body">
              Enter your Order ID (e.g., HAP-2026-8921) to check its current status.
            </p>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Order ID..."
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-full border-2 border-yellow/20 focus:border-orange bg-cream/10 outline-none transition text-foreground uppercase tracking-wide font-mono placeholder:tracking-normal placeholder:font-sans text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-orange hover:bg-orange/95 text-white font-bold transition-all shadow-[0_4px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#c4513f] cursor-pointer text-xs font-display uppercase tracking-wider"
                >
                  Track
                </button>
              </div>

              {trackError && (
                <div className="p-3 bg-coral/10 text-coral rounded-2xl text-xs font-bold font-body text-center animate-fade-in">
                  🌸 {trackError}
                </div>
              )}

              {trackingResult && (
                <div className="bg-cream/20 border border-yellow/20 rounded-2xl p-5 space-y-4 animate-fade-in font-body text-sm">
                  <div className="flex items-center justify-between border-b border-purple/5 pb-2.5">
                    <span className="font-bold text-purple">{trackingResult.id}</span>
                    <div>
                      {trackingResult.status === "pending" && (
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-xs font-bold border border-orange/20">
                          ⏳ Pending
                        </span>
                      )}
                      {trackingResult.status === "shipped" && (
                        <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-xs font-bold border border-purple/20">
                          🚚 Shipped
                        </span>
                      )}
                      {trackingResult.status === "delivered" && (
                        <span className="bg-teal/10 text-teal px-3 py-1 rounded-full text-xs font-bold border border-teal/20">
                          ✓ Delivered
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-foreground/70 text-left">
                    <p>Customer: <span className="font-bold text-purple">{trackingResult.customerName}</span></p>
                    <p>Estimate: <span className="font-bold text-teal">{trackingResult.deliveryEstimate || "3-5 business days"}</span></p>
                    <p>Total Amount: <span className="font-bold text-coral">₹{trackingResult.totalAmount}</span></p>
                  </div>

                  <div className="border-t border-purple/5 pt-3 text-left">
                    <h4 className="font-display font-semibold text-xs text-purple mb-2">Order Items:</h4>
                    <div className="max-h-28 overflow-y-auto space-y-2">
                      {trackingResult.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                          <span className="text-foreground/50 shrink-0">{item.priceString} x {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Account Settings Modal */}
      {isSettingsOpen && (
        <Dialog open={isSettingsOpen} onOpenChange={(open) => {
          if (!open) {
            setIsSettingsOpen(false);
          }
        }}>
          <DialogContent className="w-[92vw] sm:max-w-[400px] rounded-[2rem] sm:rounded-3xl p-6 bg-cream border-2 border-yellow/30 max-h-[85vh] overflow-y-auto">
            <DialogHeader className="pb-2">
              <DialogTitle className="font-display text-2xl text-purple text-center">
                ⚙️ Profile Settings
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveSettings} className="space-y-4 mt-2">
              {/* Emoji avatar selector */}
              <div>
                <label className="block text-xs font-bold text-purple uppercase tracking-wider mb-2 text-left">
                  Choose Avatar Icon
                </label>
                <div className="grid grid-cols-5 gap-2 p-3 bg-white rounded-2xl border border-purple/10">
                  {["🌸", "👧", "🐱", "🦊", "🌈", "🦄", "🐼", "🧸", "🍦", "✨"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditEmoji(emoji)}
                      className={`text-2xl p-2 rounded-xl hover:bg-cream transition cursor-pointer flex items-center justify-center border-2 ${
                        editEmoji === emoji ? "border-coral bg-cream/50" : "border-transparent"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-purple uppercase tracking-wider text-left">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-purple uppercase tracking-wider text-left">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
                />
              </div>

              {/* Phone field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-purple uppercase tracking-wider text-left">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-3 rounded-full border-2 border-purple/20 text-purple font-semibold hover:bg-purple/5 transition text-xs font-display uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-orange hover:bg-orange/95 text-white font-bold transition-all shadow-[0_4px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#c4513f] cursor-pointer text-xs font-display uppercase tracking-wider"
                >
                  Save
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
