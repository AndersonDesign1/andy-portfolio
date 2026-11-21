"use client";

import { actions } from "astro:actions";
import { useId, useState, useTransition } from "react";
import type { SubmitEvent } from "react";

import { EMAIL_REGEX } from "@/lib/constants";

const NEEDS = [
  "A new product or site",
  "A redesign",
  "SEO and performance",
  "Something else",
] as const;

const MIN_MESSAGE = 10;

type Field = "email" | "message" | "name";

const check = (data: FormData): Partial<Record<Field, string>> => {
  const errors: Partial<Record<Field, string>> = {};
  const read = (key: Field) => String(data.get(key) ?? "").trim();

  if (!read("name")) {
    errors.name = "Tell me your name.";
  }

  if (!EMAIL_REGEX.test(read("email"))) {
    errors.email = "I need an email address I can reply to.";
  }

  if (read("message").length < MIN_MESSAGE) {
    errors.message = "A sentence or two about it, please.";
  }

  return errors;
};

/**
 * The contact form: sends through the `sendEmail` Astro Action (BotID and a
 * honeypot keep bots out) and says what happened in one line under the
 * button, instead of a toast.
 */
const ContactForm = () => {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  const [pending, startTransition] = useTransition();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pending) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const found = check(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus(null);
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();

      return;
    }

    setStatus(null);
    startTransition(async () => {
      try {
        const result = await actions.sendEmail(data);

        if (result.error) {
          setStatus({
            ok: false,
            text: result.error.message || "That didn't send. Please try again.",
          });

          return;
        }

        form.reset();
        setStatus({
          ok: true,
          text: "Sent. I'll get back to you by email soon.",
        });
      } catch {
        setStatus({
          ok: false,
          text: "That didn't send. Please try again, or email me instead.",
        });
      }
    });
  };

  const described = (field: Field) =>
    errors[field] ? `${id}-${field}-error` : undefined;

  return (
    <form className="cf" method="POST" noValidate onSubmit={onSubmit}>
      <div
        aria-hidden="true"
        style={{
          height: 1,
          left: -9999,
          overflow: "hidden",
          position: "absolute",
          width: 1,
        }}
      >
        <label htmlFor={`${id}-milestone`}>Project milestone</label>
        <input
          autoComplete="off"
          defaultValue=""
          id={`${id}-milestone`}
          name="projectMilestone"
          tabIndex={-1}
          type="text"
        />
      </div>
      <div className="two">
        <div className="fld">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input
            aria-describedby={described("name")}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            id={`${id}-name`}
            maxLength={100}
            name="name"
            type="text"
          />
          {errors.name && (
            <span className="err" id={`${id}-name-error`}>
              {errors.name}
            </span>
          )}
        </div>
        <div className="fld">
          <label htmlFor={`${id}-email`}>Your email</label>
          <input
            aria-describedby={described("email")}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            id={`${id}-email`}
            inputMode="email"
            name="email"
            type="email"
          />
          {errors.email && (
            <span className="err" id={`${id}-email-error`}>
              {errors.email}
            </span>
          )}
        </div>
      </div>
      <div className="fld">
        <label htmlFor={`${id}-need`}>What do you need?</label>
        <select defaultValue={NEEDS[0]} id={`${id}-need`} name="subject">
          {NEEDS.map((need) => (
            <option key={need} value={need}>
              {need}
            </option>
          ))}
        </select>
      </div>
      <div className="fld">
        <label htmlFor={`${id}-message`}>Tell me about it</label>
        <textarea
          aria-describedby={described("message")}
          aria-invalid={Boolean(errors.message)}
          id={`${id}-message`}
          maxLength={5000}
          name="message"
          placeholder="What you're building, who it's for, and when you'd like it live"
          rows={5}
        />
        {errors.message && (
          <span className="err" id={`${id}-message-error`}>
            {errors.message}
          </span>
        )}
      </div>
      <div className="actions">
        <button className="btn solid" disabled={pending} type="submit">
          {pending ? "Sending…" : "Send"} <span className="arr">→</span>
        </button>
        <output aria-live="polite" className="sent">
          {status?.text}
        </output>
      </div>
    </form>
  );
};

export default ContactForm;
