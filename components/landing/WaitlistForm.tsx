"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "hero" }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(body.error ?? "Something broke. Try again in a bit.");
        return;
      }
      setState("success");
      setMessage(body.message ?? "On the list. Watch for the invite.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Your email"
        className="flex-1 rounded-md border border-border bg-panel px-3 py-2 text-sm text-fg placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        disabled={state === "loading" || state === "success"}
      />
      <button
        type="submit"
        disabled={state === "loading" || state === "success"}
        className="rounded-md border border-border bg-panel/60 px-4 py-2 text-sm font-semibold text-fg hover:border-accent/60 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "…" : state === "success" ? "✓" : "Waitlist"}
      </button>
      {message && (
        <p className={`sm:col-span-2 mt-2 text-xs ${state === "error" ? "text-err" : "text-ok"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
