"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VIDEO_ID = "98uVImfPgcI";
const POSTER = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const EMBED = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`;
const CAPTION =
  "България чрез дизайн: Как може естетиката да промени съдбата на една държава?";

export function VideoSection() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  // While the lightbox is open: lock body scroll, close on Escape, move focus
  // into the dialog, and restore focus to the poster when it closes.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open, close]);

  return (
    <section className="mx-auto w-full max-w-[640px] px-4 pt-10 sm:pt-16">
      <div className="flex flex-col gap-5">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Гледай видеото"
          className="group relative aspect-[640/400] w-full overflow-hidden rounded-[20px] bg-brand-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-50"
        >
          {/* External YouTube poster — plain img keeps next.config decoupled from YouTube's CDN. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={POSTER}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-200 group-hover:scale-110 sm:h-20 sm:w-20"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-ink sm:h-8 sm:w-8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
        <p className="text-sm font-medium leading-[1.1] text-ink-2">{CAPTION}</p>
      </div>

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={CAPTION}
              onClick={close}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative aspect-video w-[80vw] max-w-[150vh] overflow-hidden rounded-xl bg-black shadow-2xl"
              >
                <iframe
                  src={EMBED}
                  title={CAPTION}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Затвори"
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
