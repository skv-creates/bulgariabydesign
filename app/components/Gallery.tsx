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
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);

  const setRate = (rate: number) => {
    const anim = animRef.current;
    if (!anim) return;
    // updatePlaybackRate preserves the current position by dividing by the
    // rate — which is undefined at 0 and snaps the track back to the first
    // frame. Use the synchronous setter when stopping; it just holds in place.
    if (rate !== 0 && typeof anim.updatePlaybackRate === "function") {
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
      if (resumeTimerRef.current == null && !draggingRef.current) setRate(HOVER_RATE);
    };
    const resume = () => {
      hoveringRef.current = false;
      if (resumeTimerRef.current == null && !draggingRef.current) setRate(1);
    };
    root.addEventListener("pointerenter", slow);
    root.addEventListener("pointerleave", resume);

    // Touch/pen drag-to-scrub: translate finger movement into the animation's
    // currentTime so the marquee can be swiped on mobile.
    const SWIPE_THRESHOLD = 8;
    let activeId: number | null = null;
    let startX = 0;
    let startTime = 0;
    let pxToTime = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || activeId !== null) return;
      activeId = e.pointerId;
      startX = e.clientX;
      startTime = Number(anim.currentTime ?? 0) || 0;
      // translateX(-50%) covers exactly one of the two image sets.
      const oneSetWidth = track.scrollWidth / 2 || 1;
      pxToTime = BASE_DURATION_MS / oneSetWidth;
      draggingRef.current = false;
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      const dx = e.clientX - startX;
      if (!draggingRef.current) {
        if (Math.abs(dx) < SWIPE_THRESHOLD) return;
        draggingRef.current = true;
        setRate(0);
        try {
          root.setPointerCapture(e.pointerId);
        } catch {}
      }
      // Dragging right reveals earlier images, i.e. rewinds currentTime.
      const target = startTime - dx * pxToTime;
      anim.currentTime =
        ((target % BASE_DURATION_MS) + BASE_DURATION_MS) % BASE_DURATION_MS;
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== activeId) return;
      activeId = null;
      try {
        root.releasePointerCapture(e.pointerId);
      } catch {}
      // Touch/pen taps and drags both end in a synthetic click on the nudge
      // halves — swallow it so only swipe drives the slideshow on mobile.
      suppressClickRef.current = true;
      if (draggingRef.current) {
        draggingRef.current = false;
        setRate(hoveringRef.current ? HOVER_RATE : 1);
      }
    };

    // Swallow the click that follows any touch/pen interaction (see onUp).
    const onClickCapture = (e: Event) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        e.stopPropagation();
        e.preventDefault();
      }
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    root.addEventListener("click", onClickCapture, true);

    return () => {
      root.removeEventListener("pointerenter", slow);
      root.removeEventListener("pointerleave", resume);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("click", onClickCapture, true);
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
      className="relative mt-10 scroll-mt-24 touch-pan-y overflow-hidden py-10 sm:mt-16"
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
