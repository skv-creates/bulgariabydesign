"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-page/80 backdrop-blur-md border-b border-brand-20/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1416px] items-center justify-between px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
        <a href="#top" aria-label="България чрез дизайн" className="block">
          <Image
            src="/images/logo-nav.svg"
            alt="България чрез дизайн"
            width={112}
            height={39}
            priority
            style={{ height: "auto" }}
            className="w-[80px] sm:w-[98px]"
          />
        </a>
        <p className="flex items-center gap-2 text-right text-xs font-medium text-ink sm:text-sm">
          <span aria-hidden className="text-brand-50">
            ✻
          </span>
          <span className="hidden sm:inline">
            Инициатива на Българския Дизайн Съвет
          </span>
          <span className="sm:hidden">Българският Дизайн Съвет</span>
        </p>
      </div>
    </nav>
  );
}
