"use client";

import { useActionState } from "react";
import { submitSupport, type SubmitState } from "@/app/actions";

const initial: SubmitState = { status: "idle" };

export function SupportForm() {
  const [state, formAction, pending] = useActionState(submitSupport, initial);

  return (
    <div className="flex flex-col gap-10 rounded-xl bg-brand-30 p-8 sm:p-10">
      <div className="flex max-w-[400px] flex-col gap-4">
        <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Подкрепи визията
        </h3>
        <p className="text-sm leading-[1.4] text-ink-2">
          Вярваме, че визуалният език на държавата е огледало на нейното
          отношение към нас. Ако и ти мислиш така – включи се.
        </p>
      </div>

      {state.status === "success" ? (
        <p
          className="flex items-center gap-3 text-lg font-semibold text-ink"
          role="status"
        >
          <span aria-hidden>✓</span>
          <span>Благодаря за подкрепата</span>
        </p>
      ) : (
        <form
          action={formAction}
          className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:gap-10"
        >
          <label className="flex flex-1 flex-col gap-3 min-w-0">
            <span className="text-sm font-medium text-ink-3">Твоят email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              disabled={pending}
              aria-invalid={state.status === "error"}
              className="w-full border-0 border-b border-brand-50 bg-transparent pb-2 text-sm text-ink placeholder:text-ink-3/60 focus:border-ink focus:outline-none disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white px-8 text-sm font-semibold text-ink transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60 sm:w-[173px]"
          >
            {pending ? "Изпращаме…" : "Подкрепи"}
          </button>
        </form>
      )}

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-ink">
          {state.message}
        </p>
      )}
    </div>
  );
}
