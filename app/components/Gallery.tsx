"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

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
const NUDGE_PAUSE_MS = 1200;

export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const hoveringRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  const setRate = (rate: number) => {
    const anim = animRef.current;
    if (!anim) return;
    if (typeof anim.updatePlaybackRate === "function") {
      anim.updatePlaybackRate(rate);
    } else {
      anim.playbackRate = rate;
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof track.animate !== "function") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const anim = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: BASE_DURATION_MS, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;

    const root = track.parentElement;
    if (!root) return;
    const slow = () => {
      hoveringRef.current = true;
      if (resumeTimerRef.current == null) setRate(HOVER_RATE);
    };
    const resume = () => {
      hoveringRef.current = false;
      if (resumeTimerRef.current == null) setRate(1);
    };
    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", resume);

    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", resume);
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      anim.cancel();
      animRef.current = null;
    };
  }, []);

  const nudge = useCallback((direction: 1 | -1) => {
    const anim = animRef.current;
    if (!anim) return;

    const step = BASE_DURATION_MS / images.length;
    const rawCurrent = Number(anim.currentTime ?? 0) || 0;
    const target = rawCurrent + direction * step;
    const normalized =
      ((target % BASE_DURATION_MS) + BASE_DURATION_MS) % BASE_DURATION_MS;
    anim.currentTime = normalized;

    setRate(0);
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      setRate(hoveringRef.current ? HOVER_RATE : 1);
    }, NUDGE_PAUSE_MS);
  }, []);

  return (
    <section
      id="gallery"
      aria-label="Галерия"
      className="relative mt-10 scroll-mt-24 overflow-hidden py-10 sm:mt-16"
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
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Предишно изображение"
        className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-w-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
      />
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Следващо изображение"
        className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-e-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
      />
    </section>
  );
}
