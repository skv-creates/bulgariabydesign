"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: string;
  className?: string;
}

export function FitText({ children, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;

    const fit = () => {
      text.style.fontSize = "100px";
      text.style.width = "max-content";
      const scale = wrap.offsetWidth / text.offsetWidth;
      text.style.width = "";
      text.style.fontSize = `${100 * scale}px`;
    };

    document.fonts.ready.then(fit);

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      style={{ containerType: "inline-size" }}
    >
      <h1
        ref={textRef}
        className={className}
        style={{ whiteSpace: "nowrap", display: "block", fontSize: "11.13cqi" }}
      >
        {children}
      </h1>
    </div>
  );
}
