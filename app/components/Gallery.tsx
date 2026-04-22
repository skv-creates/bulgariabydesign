"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const images = [
  { src: "/images/gallery-01.png", alt: "" },
  { src: "/images/gallery-02.png", alt: "" },
  { src: "/images/gallery-03.png", alt: "" },
  { src: "/images/gallery-04.png", alt: "" },
  { src: "/images/gallery-05.png", alt: "" },
  { src: "/images/gallery-06.png", alt: "" },
  { src: "/images/gallery-07.png", alt: "" },
] as const;

const BASE_DURATION_MS = 90_000;
const HOVER_RATE = 0.3;

export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof track.animate !== "function") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const anim = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: BASE_DURATION_MS, iterations: Infinity, easing: "linear" },
    );

    const root = track.parentElement;
    if (!root) return;
    const setRate = (rate: number) => {
      if (typeof anim.updatePlaybackRate === "function") {
        anim.updatePlaybackRate(rate);
      } else {
        anim.playbackRate = rate;
      }
    };
    const slow = () => setRate(HOVER_RATE);
    const resume = () => setRate(1);
    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", resume);

    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", resume);
      anim.cancel();
    };
  }, []);

  return (
    <section
      id="gallery"
      aria-label="Галерия"
      className="mt-10 scroll-mt-24 overflow-hidden py-10 sm:mt-16"
    >
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {[...images, ...images].map((img, i) => (
          <div
            key={i}
            className="relative aspect-[1920/1080] h-[45vw] max-h-[712px] shrink-0 overflow-hidden rounded-xl border-4 border-white/60 sm:h-[50vw] lg:h-[632px]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 1124px, 90vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
