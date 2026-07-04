import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

interface AccordionItemProps {
  title: string;
  to?: string;          // if set, the title navigates instead of toggling
  children: React.ReactNode;
}

function AccordionItem({ title, to, children }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  if (to) {
    return (
      <div className="border-b border-[#E8DDF8]/20">
        <Link
          to={to}
          className="w-full flex items-center justify-between py-4 text-left font-display text-lg font-bold text-orange hover:text-orange/80 transition cursor-pointer"
        >
          <span>{title}</span>
          <span className="font-display font-bold text-orange text-2xl leading-none pl-4 select-none">
            +
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="border-b border-[#E8DDF8]/20">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-4 text-left font-display text-lg font-bold text-orange hover:text-orange/80 transition cursor-pointer border-none bg-transparent outline-none focus:outline-none"
      >
        <span>{title}</span>
        {/* + toggle always available */}
        <span
          className="text-orange text-2xl leading-none transition-transform duration-300 pl-4 select-none"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div className="pb-4 text-sm text-[#E8DDF8] space-y-2">{children}</div>
      </div>
    </div>
  );
}

function SocialIcons({ hoverBgClass }: { hoverBgClass: string }) {
  return (
    <div className="mt-5 flex items-center gap-4">
      {/* Instagram Logo */}
      <a
        href="https://www.instagram.com/hapyezta?igsh=ZDN6ZGNhMXZpdmpt"
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${hoverBgClass}`}
        title="Follow us on Instagram"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="url(#ig-footer-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="5" width="22" height="22" rx="6" />
          <circle cx="16" cy="16" r="5" />
          <circle cx="22" cy="10" r="1.2" />
        </svg>
      </a>

      {/* WhatsApp Logo */}
      <a
        href="https://wa.me/918921502990"
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center justify-center p-1 rounded-xl transition-all duration-300 ${hoverBgClass}`}
        title="Chat with us on WhatsApp"
      >
        <svg
          viewBox="0 0 16 16"
          className="w-10 h-10 p-[3px] transition-transform duration-300 group-hover:scale-110"
          fill="#25D366"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
      </a>
    </div>
  );
}

export function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for staying linked! 🌸");
  };

  return (
    <footer className="bg-cream text-foreground pt-10 pb-6 px-4">
      {/* Global SVG Gradients definitions */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <linearGradient id="ig-footer-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9ce34" />
            <stop offset="30%" stopColor="#ee2a7b" />
            <stop offset="60%" stopColor="#d82b7a" />
            <stop offset="100%" stopColor="#6228d7" />
          </linearGradient>
        </defs>
      </svg>
      {/* ── Mobile accordion (hidden on lg+) ── */}
      <div className="lg:hidden max-w-xl mx-auto">
        <AccordionItem title="About Us">
          <div className="flex flex-col items-start mb-3">
            <Logo size="sm" withSlogan={true} className="items-start text-left" />
          </div>
          <p className="text-foreground/70">
            Spreading kawaii joy, one cute package at a time. Pan-India delivery.
          </p>
        </AccordionItem>

        <AccordionItem title="Let's stay linked!">
          <div>
            <p className="text-foreground/70 mb-2">Get cute drops in your inbox.</p>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="you@cute.com"
                className="flex-1 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 placeholder:text-foreground/40 text-sm text-foreground outline-none focus:border-orange/50"
              />
              <button type="submit" className="px-4 py-2 rounded-full bg-orange hover:bg-purple text-white transition font-semibold text-sm">
                Join
              </button>
            </form>
            <SocialIcons hoverBgClass="hover:bg-orange/10" />
          </div>
        </AccordionItem>

        <AccordionItem title="Contact Us" to="/contact">
          <ul className="space-y-2">
            <li>
              <Link to="/contact" className="text-foreground/80 hover:text-orange transition">
                Contact page
              </Link>
            </li>
            <li>
              <Link to="/" hash="collection" className="text-foreground/80 hover:text-orange transition">
                Track order
              </Link>
            </li>
            <li>
              <Link to="/" hash="collection" className="text-foreground/80 hover:text-orange transition">
                Shipping info
              </Link>
            </li>
            <li>
              <Link to="/" hash="collection" className="text-foreground/80 hover:text-orange transition">
                Returns
              </Link>
            </li>
          </ul>
        </AccordionItem>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-foreground/50">
          © {new Date().getFullYear()} Hapyezta · Made by{" "}
          <a
            href="https://codexora.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-orange transition"
          >
            Codexora
          </a>
        </div>
      </div>

      {/* ── Desktop grid (hidden on mobile) ── */}
      <div className="hidden lg:block bg-[#5B2D91] text-white rounded-2xl pt-14 pb-8 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col items-start">
              <Logo size="md" withSlogan={true} className="items-start text-left" />
            </div>
            <p className="mt-3 text-sm text-[#E8DDF8]">
              Spreading kawaii joy, one cute package at a time. Pan-India delivery.
            </p>
          </div>
          <div>
            <div className="font-display text-lg mb-3 text-white font-semibold">
              <Link to="/products" className="hover:text-[#FFB84D] transition">Shop</Link>
            </div>
            <ul className="space-y-2 text-sm text-[#E8DDF8]">
              <li><Link to="/products" search={{ category: "Cute Stationery" }} className="hover:text-[#FFB84D] transition">Stationery</Link></li>
              <li><Link to="/products" search={{ category: "Journal Supplies" }} className="hover:text-[#FFB84D] transition">Journals</Link></li>
              <li><Link to="/products" search={{ category: "Gift Sets" }} className="hover:text-[#FFB84D] transition">Gift sets</Link></li>
              <li><Link to="/products" search={{ category: "Bottles & Tumblers" }} className="hover:text-[#FFB84D] transition">Bottles</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-lg mb-3 text-white font-semibold">Help</div>
            <ul className="space-y-2 text-sm text-[#E8DDF8]">
              <li><Link to="/" hash="collection" className="hover:text-[#FFB84D] transition">Track order</Link></li>
              <li><Link to="/" hash="collection" className="hover:text-[#FFB84D] transition">Shipping</Link></li>
              <li><Link to="/" hash="collection" className="hover:text-[#FFB84D] transition">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-[#FFB84D] transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-lg mb-3 text-white font-semibold">Stay in the loop</div>
            <p className="text-sm text-[#E8DDF8] mb-3">Get cute drops in your inbox.</p>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="you@cute.com"
                className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-[#E8DDF8]/20 placeholder:text-[#E8DDF8]/50 text-sm text-white outline-none focus:border-[#FFB84D]/50"
              />
              <button type="submit" className="px-4 py-2 rounded-full bg-[#FFB84D] hover:bg-white text-[#5B2D91] transition font-semibold text-sm">
                Join
              </button>
            </form>
            <SocialIcons hoverBgClass="hover:bg-white/10" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#E8DDF8]/20 text-center text-xs text-[#E8DDF8]/70">
          © {new Date().getFullYear()} Hapyezta · Made by{" "}
          <a
            href="https://codexora.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white hover:text-[#FFB84D] transition"
          >
            Codexora
          </a>
        </div>
      </div>
    </footer>
  );
}

