"use client";

import { useEffect, useRef } from "react";

const TRIGGER_RATIO = 0.45;
const BAND_PX = 40;

export function ManifestParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const words = Array.from(
      container.querySelectorAll<HTMLElement>("[data-word]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    const update = () => {
      const triggerY = window.innerHeight * TRIGGER_RATIO;
      for (const w of words) {
        const y = w.getBoundingClientRect().top;
        const t = (triggerY - y) / BAND_PX;
        const opacity = Math.min(1, Math.max(0.5, 0.5 + 0.5 * t));
        w.style.opacity = String(opacity);
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-16 flex flex-col gap-[1.1em] text-[28px] font-semibold leading-[1.1] text-ink sm:text-[36px] lg:text-[40px]"
    >
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split(/(\s+)/).map((token, j) =>
            /^\s+$/.test(token) ? (
              token
            ) : (
              <span key={j} data-word style={{ opacity: 0.5 }}>
                {token}
              </span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
