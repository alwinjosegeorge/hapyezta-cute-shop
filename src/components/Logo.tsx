import React from "react";
import logoImg from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  withSlogan?: boolean;
  size?: "sm" | "md" | "lg";
  collapseOnScroll?: boolean;
  isScrolled?: boolean;
}

export function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Hapyezta Logo Icon"
      className={`${className} object-contain`}
    />
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  // Mapping of each letter in HAPYEZTA to its specific color
  const letters = [
    { char: "H", color: "text-orange" },
    { char: "A", color: "text-yellow" },
    { char: "P", color: "text-teal" },
    { char: "Y", color: "text-purple" },
    { char: "E", color: "text-coral" },
    { char: "Z", color: "text-purple" },
    { char: "T", color: "text-teal" },
    { char: "A", color: "text-orange" },
  ];

  return (
    <span className={`font-display select-none tracking-normal ${className}`}>
      {letters.map((item, index) => (
        <span key={index} className={item.color}>
          {item.char}
        </span>
      ))}
    </span>
  );
}

export function Logo({
  className = "",
  iconOnly = false,
  withSlogan = true,
  size = "md",
  collapseOnScroll = false,
  isScrolled: controlledIsScrolled,
}: LogoProps) {
  const [internalIsScrolled, setInternalIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!collapseOnScroll || controlledIsScrolled !== undefined) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setInternalIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [collapseOnScroll, controlledIsScrolled]);

  const isScrolled = controlledIsScrolled !== undefined ? controlledIsScrolled : internalIsScrolled;

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-4xl sm:text-5xl",
  };

  const sloganSizes = {
    sm: "text-[8px] tracking-[0.12em]",
    md: "text-[9px] tracking-[0.15em]",
    lg: "text-xs tracking-[0.18em]",
  };

  if (iconOnly) {
    return <LogoIcon className={iconSizes[size]} />;
  }

  const isCollapsed = collapseOnScroll && isScrolled;

  return (
    <div className={`inline-flex flex-col items-center justify-center transition-all duration-300 ${className}`}>
      {/* Logo Icon on Top */}
      <div
        className={`transition-all duration-300 ease-in-out origin-top ${
          isCollapsed
            ? "max-h-0 opacity-0 scale-0 mb-0 pointer-events-none overflow-hidden"
            : "max-h-16 opacity-100 scale-100 mb-1.5"
        }`}
      >
        <LogoIcon className={`${iconSizes[size]} transition-transform hover:scale-105 duration-300`} />
      </div>
      
      {/* Brand Text */}
      <LogoText className={`${textSizes[size]} font-bold tracking-tight leading-none`} />

      {/* Slogan */}
      {withSlogan && (
        <div
          className={`transition-all duration-300 ease-in-out origin-bottom ${
            isCollapsed
              ? "max-h-0 opacity-0 scale-0 mt-0 pointer-events-none overflow-hidden"
              : "max-h-8 opacity-100 scale-100 mt-1.5"
          }`}
        >
          <span
            className={`block uppercase font-bold text-orange leading-none select-none text-center ${sloganSizes[size]}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where Happy Creation Begin
          </span>
        </div>
      )}
    </div>
  );
}
