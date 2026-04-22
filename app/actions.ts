"use server";

export type SubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitSupport(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Моля, въведи валиден email адрес." };
  }

  const webhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhook) {
    console.error("GOOGLE_SHEET_WEBHOOK_URL is not set");
    return {
      status: "error",
      message: "Сървърна грешка. Опитай пак по-късно.",
    };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        submittedAt: new Date().toISOString(),
        source: "bulgariabydesign.bg",
      }),
    });
    if (!res.ok) throw new Error(`Sheet webhook returned ${res.status}`);
  } catch (err) {
    console.error("Support form submit failed", err);
    return {
      status: "error",
      message: "Не успяхме да запишем email-a. Опитай пак.",
    };
  }

  return { status: "success" };
}
