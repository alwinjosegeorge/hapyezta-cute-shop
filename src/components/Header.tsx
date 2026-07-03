import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Heart } from "lucide-react";
import { Logo, LogoIcon, LogoText } from "./Logo";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { cartCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b-2 border-yellow/30 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 relative transition-all duration-300 ${
          isScrolled ? "h-16" : "h-24 sm:h-28 lg:h-20 lg:py-3"
        }`}
      >
        {/* Mobile Centered Full Logo (Cross-fades out on scroll) */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 lg:hidden transition-all duration-300 ease-in-out origin-center ${
            isScrolled
              ? "opacity-0 scale-75 translate-y-2 pointer-events-none"
              : "-translate-y-1/2 opacity-100 scale-100 pointer-events-auto"
          }`}
        >
          <Link to="/" className="hover:opacity-90 transition block">
            <Logo size="sm" withSlogan={true} collapseOnScroll={false} className="items-center" />
          </Link>
        </div>

        {/* Mobile Left Compact Logo (Cross-fades in on scroll) */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 lg:hidden transition-all duration-300 ease-in-out origin-left ${
            isScrolled
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-75 pointer-events-none"
          }`}
        >
          <Link to="/" className="hover:opacity-90 transition flex items-center gap-2">
            <LogoIcon className="w-8 h-8" />
            <LogoText className="text-xl font-bold tracking-tight leading-none" />
          </Link>
        </div>

        {/* Desktop Static Logo (Statically positioned in-flow, always visible on desktop) */}
        <div className="hidden lg:block">
          <Link to="/" className="hover:opacity-90 transition block">
            <Logo size="sm" withSlogan={!isScrolled} collapseOnScroll={true} isScrolled={isScrolled} className="items-start" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-foreground/80">
          <Link to="/" hash="collection" className="hover:text-coral transition">Shop</Link>
          <Link to="/" hash="featured" className="hover:text-coral transition">New In</Link>
          <Link to="/" hash="collection" className="hover:text-coral transition">Stationery</Link>
          <Link to="/" hash="collection" className="hover:text-coral transition">Gift Sets</Link>
          <Link to="/" hash="insta" className="hover:text-coral transition">Reviews</Link>
        </nav>

        {/* Right buttons (stays right-aligned on mobile via ml-auto) */}
        <div className="flex items-center gap-2 sm:gap-3 z-20 ml-auto lg:ml-0">
          <button className="p-2 hover:text-coral hidden lg:block"><Search className="w-5 h-5" /></button>
          <button className="p-2 hover:text-coral hidden sm:block"><Heart className="w-5 h-5" /></button>
          <button onClick={openCart} className="p-2 hover:text-coral relative hidden lg:block cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
