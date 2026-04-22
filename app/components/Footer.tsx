import Image from "next/image";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[800px] px-4 py-20">
      <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/logo-footer.svg"
            alt="България по дизайн"
            width={194}
            height={21}
            style={{ height: "auto" }}
            className="w-[194px]"
          />
          <p className="text-sm font-medium leading-[1.1] text-ink-2">
            Инициатива на
            <br />
            Българския Дизайн Съвет
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm font-medium text-ink-3 sm:text-right">
          <a
            href="https://www.linkedin.com/in/stefanvladimirov/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-ink"
          >
            Контакт
          </a>
          <p>© 2026 България по дизайн</p>
        </div>
      </div>
    </footer>
  );
}
