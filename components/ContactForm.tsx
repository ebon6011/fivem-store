"use client";

import { type FormEvent, useState } from "react";
import { inputClass } from "@/lib/styles";
import { CheckIcon } from "./icons";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      <input name={name} type={type} required autoComplete={autoComplete} className={inputClass} />
    </label>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="glass flex flex-col items-center p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-white">Thanks, message submitted!</h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Heads up: this form isn&apos;t connected yet, so nothing was actually sent. Please reach us on Discord for now.
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm text-zinc-300 underline-offset-4 hover:text-white hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-5 p-6">
      <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
        This form isn&apos;t connected yet. Messages are not sent anywhere. Please use Discord for support.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
      </div>
      <Field label="Subject" name="subject" />
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Message</span>
        <textarea name="message" required minLength={10} rows={6} className={inputClass} />
      </label>
      <button type="submit" className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white glow hover:brightness-110 sm:w-auto">
        Send message
      </button>
    </form>
  );
}
