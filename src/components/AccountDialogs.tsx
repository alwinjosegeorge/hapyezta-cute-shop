import React, { useState, useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Package, Settings, LogOut, ArrowLeft, Award, Sparkles, Heart } from "lucide-react";

export function AccountDialogs() {
  const {
    isAccountOpen,
    closeAccount,
    profileName,
    profileEmoji,
    profileEmail,
    profilePhone,
    saveProfile,
  } = useAccount();

  // Desktop active tab: 'overview' | 'track' | 'settings'
  const [activeTab, setActiveTab] = useState<"overview" | "track" | "settings">("overview");

  // Mobile active sub-view: 'menu' | 'track' | 'settings'
  const [mobileView, setMobileView] = useState<"menu" | "track" | "settings">("menu");

  const [trackOrderId, setTrackOrderId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState("");

  const [editName, setEditName] = useState(profileName);
  const [editEmoji, setEditEmoji] = useState(profileEmoji);
  const [editEmail, setEditEmail] = useState(profileEmail);
  const [editPhone, setEditPhone] = useState(profilePhone);

  // Sync edits when profile values change
  useEffect(() => {
    setEditName(profileName);
    setEditEmoji(profileEmoji);
    setEditEmail(profileEmail);
    setEditPhone(profilePhone);
  }, [profileName, profileEmoji, profileEmail, profilePhone, isAccountOpen]);

  // Reset tabs/views on modal open
  useEffect(() => {
    if (isAccountOpen) {
      setActiveTab("overview");
      setMobileView("menu");
      setTrackOrderId("");
      setTrackingResult(null);
      setTrackError("");
    }
  }, [isAccountOpen]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(editName, editEmoji, editEmail, editPhone);
    alert("Profile settings saved successfully! 🌸");
    if (mobileView === "settings") {
      setMobileView("menu");
    }
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

  const handleLogout = () => {
    alert("Logged out successfully. See you soon! 🌸");
    closeAccount();
  };

  // Shared Track Orders Form Component
  const renderTrackForm = () => (
    <div className="space-y-4 font-body">
      <form onSubmit={handleTrackSubmit} className="space-y-3">
        <label className="block text-xs font-bold text-purple uppercase tracking-wider text-left">
          Enter Order ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., HAP-2026-8921"
            value={trackOrderId}
            onChange={(e) => setTrackOrderId(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border-2 border-yellow/20 focus:border-coral bg-cream/10 outline-none transition text-foreground uppercase tracking-wide font-mono placeholder:tracking-normal placeholder:font-sans text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-orange hover:bg-orange/95 text-white font-bold transition-all shadow-[0_3px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#c4513f] cursor-pointer text-xs font-display uppercase tracking-wider"
          >
            Track
          </button>
        </div>

        {trackError && (
          <div className="p-3 bg-coral/10 text-coral rounded-2xl text-xs font-bold text-center animate-fade-in">
            🌸 {trackError}
          </div>
        )}
      </form>

      {trackingResult ? (
        <div className="bg-cream/45 border border-yellow/20 rounded-2xl p-4 space-y-3.5 animate-fade-in text-sm text-left">
          <div className="flex items-center justify-between border-b border-purple/5 pb-2.5">
            <span className="font-bold text-purple font-mono">{trackingResult.id}</span>
            <div>
              {trackingResult.status === "pending" && (
                <span className="bg-orange/10 text-orange px-2.5 py-0.5 rounded-full text-xs font-bold border border-orange/20">
                  ⏳ Pending
                </span>
              )}
              {trackingResult.status === "shipped" && (
                <span className="bg-purple/10 text-purple px-2.5 py-0.5 rounded-full text-xs font-bold border border-purple/20">
                  🚚 Shipped
                </span>
              )}
              {trackingResult.status === "delivered" && (
                <span className="bg-teal/10 text-teal px-2.5 py-0.5 rounded-full text-xs font-bold border border-teal/20">
                  ✓ Delivered
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-foreground/75">
            <p>Customer: <span className="font-semibold text-purple">{trackingResult.customerName}</span></p>
            <p>Estimate: <span className="font-semibold text-teal">{trackingResult.deliveryEstimate || "3-5 days"}</span></p>
            <p className="col-span-2">Total Amount: <span className="font-bold text-coral">₹{trackingResult.totalAmount}</span></p>
          </div>

          <div className="border-t border-purple/5 pt-2.5">
            <h4 className="font-display font-semibold text-xs text-purple mb-2">Order Items:</h4>
            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
              {trackingResult.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs text-foreground/80">
                  <span className="truncate max-w-[160px] md:max-w-[200px]" title={item.name}>{item.name}</span>
                  <span className="text-foreground/50 shrink-0 font-mono">₹{item.price} x {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground/60 border border-dashed border-purple/10 rounded-2xl">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-30 text-purple" />
          <p className="text-xs">No active order results. Submit an ID above to view details!</p>
        </div>
      )}
    </div>
  );

  // Shared Account Settings Form Component
  const renderSettingsForm = () => (
    <form onSubmit={handleSaveSettings} className="space-y-4 font-body">
      {/* Avatar Picker */}
      <div>
        <label className="block text-xs font-bold text-purple uppercase tracking-wider mb-1.5 text-left">
          Choose Avatar Icon
        </label>
        <div className="grid grid-cols-5 gap-1.5 p-2 bg-white rounded-2xl border border-purple/10">
          {["🌸", "👧", "🐱", "🦊", "🌈", "🦄", "🐼", "🧸", "🍦", "✨"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setEditEmoji(emoji)}
              className={`text-xl p-1.5 rounded-xl hover:bg-cream transition cursor-pointer flex items-center justify-center border-2 ${
                editEmoji === emoji ? "border-coral bg-cream/50" : "border-transparent"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div className="space-y-1 text-left">
          <label className="block text-xs font-bold text-purple uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            required
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="block text-xs font-bold text-purple uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            required
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
          />
        </div>

        <div className="space-y-1 text-left">
          <label className="block text-xs font-bold text-purple uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="text"
            required
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-white border-2 border-purple/10 focus:border-coral outline-none text-foreground font-body text-sm transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-full bg-orange hover:bg-orange/95 text-white font-bold transition-all shadow-[0_3px_0_0_#c4513f] hover:translate-y-0.5 hover:shadow-[0_1px_0_0_#c4513f] cursor-pointer text-xs font-display uppercase tracking-wider"
      >
        Save Changes
      </button>
    </form>
  );

  return (
    <Dialog open={isAccountOpen} onOpenChange={(open) => !open && closeAccount()}>
      {/* 
        Responsive Dialog sizing: 
        - Mobile: max-w-[400px] / vertical stack
        - Desktop (md): max-w-[800px] / beautiful horizontal split layout
      */}
      <DialogContent className="w-[95vw] md:max-w-[800px] rounded-[2.2rem] p-0 overflow-hidden bg-cream border-2 border-yellow/20 z-[60] shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Kawaii Club Profile Dashboard</DialogTitle>
        </DialogHeader>

        {/* ========================================================================= */}
        {/* DESKTOP SPLIT DASHBOARD LAYOUT (hidden on mobile, visible md+) */}
        {/* ========================================================================= */}
        <div className="hidden md:grid grid-cols-12 min-h-[480px]">
          {/* LEFT PANEL: Profile Summary & Stats */}
          <div className="col-span-5 bg-gradient-to-b from-yellow/20 via-coral/5 to-purple/5 p-8 flex flex-col justify-between border-r border-purple/5 text-center relative">
            <div className="space-y-5">
              {/* Pulsing avatar & ring */}
              <div className="relative w-28 h-28 mx-auto mt-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral to-purple opacity-20 animate-pulse scale-110" />
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-coral to-purple grid place-items-center text-4xl border-4 border-white shadow-lg select-none relative z-10 animate-bounce">
                  {profileEmoji}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl text-purple font-bold tracking-wide">
                  {profileName}
                </h3>
                <p className="text-[11px] text-purple/60 font-body">Member since May 2026</p>
              </div>

              {/* Sparkle badge */}
              <div className="inline-flex items-center gap-1.5 bg-yellow/30 text-purple text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mx-auto">
                👑 Sparkle VIP Member
              </div>
            </div>

            {/* Kawaii Club Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-6 bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-purple/5 shadow-sm">
              <div className="text-center">
                <span className="block font-display text-base text-coral font-bold">₹4.2k</span>
                <span className="text-[9px] font-bold text-purple/50 uppercase font-body">Saved</span>
              </div>
              <div className="text-center border-x border-purple/5">
                <span className="block font-display text-base text-teal font-bold">6</span>
                <span className="text-[9px] font-bold text-purple/50 uppercase font-body">Orders</span>
              </div>
              <div className="text-center">
                <span className="block font-display text-base text-purple font-bold">420</span>
                <span className="text-[9px] font-bold text-purple/50 uppercase font-body">Points</span>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground/60 font-body">
              🌸 Handcrafted with love by Hapyezta
            </div>
          </div>

          {/* RIGHT PANEL: Workspace Pane */}
          <div className="col-span-7 p-8 flex flex-col justify-between">
            {/* Header Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple/5 pb-3">
                <h4 className="font-display text-2xl text-purple font-bold flex items-center gap-2">
                  {activeTab === "overview" && "🏠 Welcome Back!"}
                  {activeTab === "track" && "📦 Track Order"}
                  {activeTab === "settings" && "⚙️ Profile Settings"}
                </h4>
              </div>

              {/* Tab Navigation Menu */}
              <div className="flex gap-1.5 bg-cream/80 p-1 rounded-full border border-purple/5 text-xs font-semibold text-purple">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1 cursor-pointer border-none bg-transparent ${
                    activeTab === "overview" ? "bg-white text-coral shadow-sm font-bold" : "hover:text-coral"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("track")}
                  className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1 cursor-pointer border-none bg-transparent ${
                    activeTab === "track" ? "bg-white text-coral shadow-sm font-bold" : "hover:text-coral"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  Track Order
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 py-2 px-3 rounded-full transition flex items-center justify-center gap-1 cursor-pointer border-none bg-transparent ${
                    activeTab === "settings" ? "bg-white text-coral shadow-sm font-bold" : "hover:text-coral"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
              </div>

              {/* Workspace Content Display */}
              <div className="pt-2 min-h-[260px]">
                {activeTab === "overview" && (
                  <div className="space-y-4 text-left font-body animate-fade-in">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Hi <span className="font-bold text-purple">{profileName}</span>! Welcome back to your kawaii clubhouse. 🌸 We've added fresh stickers and stationery treasures since your last visit.
                    </p>

                    {/* Cute rewards card */}
                    <div className="bg-yellow/10 border-2 border-dashed border-yellow/45 rounded-2xl p-4 flex items-start gap-3">
                      <Award className="w-9 h-9 text-coral shrink-0 mt-0.5 animate-bounce" />
                      <div className="space-y-1">
                        <span className="block text-xs font-bold text-purple uppercase tracking-wider">
                          Next Club Reward: Free Washi Tape Set 🎀
                        </span>
                        <div className="w-full bg-purple/10 h-2.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-gradient-to-r from-coral to-yellow h-full rounded-full w-[80%]" />
                        </div>
                        <span className="block text-[10px] text-muted-foreground">
                          420 / 500 Sparkles collected • Just 80 more points to redeem!
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-teal/5 border border-teal/10 rounded-2xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal" />
                        <span className="text-xs text-purple/90">Free shipping tier active</span>
                      </div>
                      <div className="flex-1 p-3 bg-coral/5 border border-coral/10 rounded-2xl flex items-center gap-2">
                        <Heart className="w-4 h-4 text-coral fill-coral/10" />
                        <span className="text-xs text-purple/90">Curated kawaii picks</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "track" && renderTrackForm()}

                {activeTab === "settings" && renderSettingsForm()}
              </div>
            </div>

            {/* Logout button footer */}
            <div className="border-t border-purple/5 pt-4 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-red-500 hover:bg-red-50 transition text-xs font-bold cursor-pointer border-none bg-transparent"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE PORTRAIT DASHBOARD LAYOUT (hidden on desktop, visible mobile/tablet) */}
        {/* ========================================================================= */}
        <div className="block md:hidden p-6 max-h-[85vh] overflow-y-auto">
          {mobileView === "menu" && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-purple/5">
                <h4 className="font-display text-2xl text-purple text-center font-bold">
                  ✨ Kawaii Club Profile
                </h4>
              </div>

              {/* Mobile Profile Card */}
              <div className="bg-white rounded-3xl p-5 border border-purple/10 shadow-sm text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-coral to-purple grid place-items-center text-3xl mb-3 border-4 border-cream shadow-md select-none animate-bounce">
                  {profileEmoji}
                </div>
                <h3 className="font-display text-lg text-purple font-bold text-center">
                  {profileName}
                </h3>
                <p className="text-[10px] text-muted-foreground text-center">Member since May 2026</p>

                {/* VIP badge */}
                <div className="flex justify-center mt-3">
                  <div className="inline-flex items-center gap-1.5 bg-yellow/30 text-purple text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mx-auto">
                    👑 Sparkle VIP Member
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-purple/5">
                  <div>
                    <span className="block font-display text-base text-coral font-bold">₹4,250</span>
                    <span className="text-[10px] text-purple/50 uppercase font-bold font-body">Saved</span>
                  </div>
                  <div>
                    <span className="block font-display text-base text-teal font-bold">6 Orders</span>
                    <span className="text-[10px] text-purple/50 uppercase font-bold font-body">Placed</span>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Action List */}
              <div className="bg-white rounded-2xl p-2 border border-purple/10 shadow-sm space-y-1 text-sm font-body">
                <button
                  onClick={() => setMobileView("track")}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-cream hover:text-coral transition font-semibold text-purple cursor-pointer border-none bg-transparent flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-purple" />
                  📦 Track My Orders
                </button>

                <button
                  onClick={() => setMobileView("settings")}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-cream hover:text-coral transition font-semibold text-purple cursor-pointer border-none bg-transparent flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-purple" />
                  ⚙️ Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition font-semibold text-red-400 cursor-pointer border-none bg-transparent flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  🚪 Log Out
                </button>
              </div>
            </div>
          )}

          {/* Mobile Track Order view */}
          {mobileView === "track" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-purple/5 pb-3">
                <button
                  onClick={() => setMobileView("menu")}
                  className="p-1.5 hover:bg-cream rounded-full transition text-purple cursor-pointer border-none bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h4 className="font-display text-xl text-purple font-bold">Track Order</h4>
              </div>
              {renderTrackForm()}
            </div>
          )}

          {/* Mobile Settings view */}
          {mobileView === "settings" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-purple/5 pb-3">
                <button
                  onClick={() => setMobileView("menu")}
                  className="p-1.5 hover:bg-cream rounded-full transition text-purple cursor-pointer border-none bg-transparent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h4 className="font-display text-xl text-purple font-bold">Edit Profile</h4>
              </div>
              {renderSettingsForm()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
