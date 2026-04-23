import Image from "next/image";
import { FitText } from "./FitText";

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto mt-2 w-full max-w-[1416px] px-4 sm:px-8 lg:px-12"
    >
      <div className="relative flex aspect-[16/11] w-full flex-col justify-between overflow-hidden rounded-2xl p-6 sm:aspect-[16/10] sm:rounded-3xl sm:p-10 lg:aspect-[1416/841] lg:p-16">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1464px) 1416px, 100vw"
          className="pointer-events-none object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/30"
        />

        <FitText className="font-display font-extrabold italic leading-[0.8] tracking-[-0.02em] text-white/90">
          България чрез дизайн
        </FitText>

        <div className="relative flex max-w-[611px] flex-col gap-6 sm:gap-10">
          <p className="text-xl font-bold leading-[1.15] tracking-tight text-white/90 sm:text-2xl lg:text-[40px] lg:leading-[1.1]">
            Красив и достоен облик на институциите, които работят за нас.
          </p>
          <a
            href="#gallery"
            className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/30 bg-brand px-8 text-sm font-semibold text-ink transition-colors hover:bg-brand-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Виж как
          </a>
        </div>
      </div>
    </section>
  );
}
