"use client";

import {
  ArrowUp02Icon,
  Mic01Icon,
  StopIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { actions } from "astro:actions";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { KeyboardEvent, RefObject, SubmitEvent } from "react";

import { useDictation } from "@/components/ai/use-dictation";
import { EMAIL_REGEX } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TOPICS = [
  "New product",
  "Redesign",
  "AI agents",
  "Something else",
] as const;

type Topic = (typeof TOPICS)[number];

interface SentNote {
  email: string;
  id: number;
  text: string;
  topic: string;
}

const MIN_MESSAGE = 10;
const MAX_MESSAGE = 5000;

const validateFields = ({
  email,
  message,
  name,
}: {
  email: string;
  message: string;
  name: string;
}): string | null => {
  if (!name.trim()) {
    return "Add your name so I know who I'm replying to.";
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return "Add a valid email address so I can reply.";
  }

  if (message.trim().length < MIN_MESSAGE) {
    return "Write or dictate at least a sentence or two about what you need.";
  }

  return null;
};

const statusHint = ({
  error,
  listening,
  transcribing,
  voiceError,
}: {
  error: string | null;
  listening: boolean;
  transcribing: boolean;
  voiceError?: string;
}): string | null => {
  if (error) {
    return error;
  }

  if (voiceError) {
    return voiceError;
  }

  if (listening) {
    return "Listening… tap stop when you're done.";
  }

  if (transcribing) {
    return "Turning your voice into text…";
  }

  return null;
};

const messagePlaceholder = (listening: boolean, hasNotes: boolean): string => {
  if (listening) {
    return "Listening…";
  }

  return hasNotes
    ? "Add a follow-up note…"
    : "Write or speak your message to Anderson…";
};

const SentThread = ({ notes }: { notes: SentNote[] }) => (
  <ol className="flex flex-col gap-4">
    <li className="max-w-[82%] self-start rounded-2xl rounded-bl-[5px] bg-[var(--surface)] px-4 py-3 text-[15px] leading-relaxed text-[var(--fg)]">
      Hey, tell me what you&apos;re building or trying to fix, and I&apos;ll
      reply by email.
    </li>
    {notes.map((note) => (
      <li className="ai-rise flex flex-col items-end gap-1.5" key={note.id}>
        <div className="max-w-[84%] rounded-2xl rounded-br-[5px] bg-[var(--fg)] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-[var(--bg)]">
          <p className="mb-1 text-xs font-medium opacity-65">{note.topic}</p>
          <p>{note.text}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-[var(--mute)]">
          <HugeiconsIcon icon={Tick02Icon} size={13} />
          Sent to Anderson&apos;s inbox · Replying to {note.email}
        </span>
      </li>
    ))}
  </ol>
);

const TopicSelector = ({
  customTopic,
  customTopicRef,
  id,
  onCustomChange,
  onSelect,
  selected,
}: {
  customTopic: string;
  customTopicRef: RefObject<HTMLInputElement | null>;
  id: string;
  onCustomChange: (value: string) => void;
  onSelect: (topic: Topic) => void;
  selected: Topic;
}) => (
  <div className="grid gap-2.5">
    <fieldset className="flex flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Topic</legend>
      {TOPICS.map((item) => {
        const active = selected === item;

        return (
          <button
            aria-pressed={active}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-[background-color,color,transform] duration-150 ease-[var(--ease)] active:scale-[0.97]",
              active
                ? "bg-[var(--fg)] text-[var(--bg)]"
                : "bg-[var(--surface)] text-[var(--fg-2)] hover:text-[var(--fg)]"
            )}
            key={item}
            onClick={() => onSelect(item)}
            type="button"
          >
            {item}
          </button>
        );
      })}
    </fieldset>

    {selected === "Something else" && (
      <div className="ai-rise">
        <label className="sr-only" htmlFor={`${id}-custom-topic`}>
          What is it about?
        </label>
        <input
          className="w-full rounded-xl bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--mute)] focus:ring-[1.5px] focus:ring-[var(--fg)]"
          id={`${id}-custom-topic`}
          maxLength={120}
          onChange={(event) => onCustomChange(event.target.value)}
          placeholder="What's it about?"
          ref={customTopicRef}
          type="text"
          value={customTopic}
        />
      </div>
    )}
  </div>
);

const SenderFields = ({
  email,
  id,
  name,
  onEmailChange,
  onNameChange,
}: {
  email: string;
  id: string;
  name: string;
  onEmailChange: (value: string) => void;
  onNameChange: (value: string) => void;
}) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div>
      <label className="sr-only" htmlFor={`${id}-name`}>
        Your name
      </label>
      <input
        autoComplete="name"
        className="w-full rounded-xl bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--mute)] focus:ring-[1.5px] focus:ring-[var(--fg)]"
        id={`${id}-name`}
        maxLength={100}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Your name"
        type="text"
        value={name}
      />
    </div>
    <div>
      <label className="sr-only" htmlFor={`${id}-email`}>
        Your email
      </label>
      <input
        autoComplete="email"
        className="w-full rounded-xl bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--mute)] focus:ring-[1.5px] focus:ring-[var(--fg)]"
        id={`${id}-email`}
        inputMode="email"
        maxLength={254}
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="Your email"
        type="email"
        value={email}
      />
    </div>
  </div>
);

const MessageBar = ({
  hasNotes,
  id,
  listening,
  message,
  onChange,
  onKeyDown,
  onToggleVoice,
  pending,
  textareaRef,
  transcribing,
  voiceSupported,
}: {
  hasNotes: boolean;
  id: string;
  listening: boolean;
  message: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onToggleVoice: () => void;
  pending: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  transcribing: boolean;
  voiceSupported: boolean;
}) => (
  <div className="flex items-end gap-2 rounded-2xl bg-[var(--surface)] p-2 pl-3.5 transition-shadow focus-within:ring-[1.5px] focus-within:ring-[var(--fg)]">
    <label className="sr-only" htmlFor={`${id}-message`}>
      Your message
    </label>
    <textarea
      className="[field-sizing:content] max-h-40 min-h-[44px] w-full resize-none bg-transparent py-1.5 text-[15.5px] leading-relaxed text-[var(--fg)] outline-none placeholder:text-[var(--mute)]"
      id={`${id}-message`}
      maxLength={MAX_MESSAGE}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={messagePlaceholder(listening, hasNotes)}
      ref={textareaRef}
      rows={2}
      value={message}
    />
    <div className="flex shrink-0 items-center gap-1.5">
      {voiceSupported && (
        <button
          aria-label={listening ? "Stop recording" : "Record a voice message"}
          aria-pressed={listening}
          className={cn(
            "inline-grid size-10 place-items-center rounded-full transition-[background-color,color,transform] duration-150 ease-[var(--ease)] active:scale-[0.94]",
            listening
              ? "bg-[var(--fg)] text-[var(--bg)]"
              : "text-[var(--fg-2)] hover:bg-[var(--raised)] hover:text-[var(--fg)]"
          )}
          disabled={pending || transcribing}
          onClick={onToggleVoice}
          title={listening ? "Stop recording" : "Dictate your message"}
          type="button"
        >
          <HugeiconsIcon
            icon={listening ? StopIcon : Mic01Icon}
            size={18}
            strokeWidth={1.7}
          />
        </button>
      )}
      <button
        aria-label="Send message"
        className="inline-grid size-10 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-[transform,opacity] duration-150 ease-[var(--ease)] hover:scale-[1.04] active:scale-[0.94] disabled:opacity-35"
        disabled={pending || transcribing || !message.trim()}
        type="submit"
      >
        <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={1.8} />
      </button>
    </div>
  </div>
);

/**
 * Direct-message contact composer: name, email, topic pills (with custom field
 * for "Something else"), voice dictation via /api/transcribe, and live sent
 * bubbles backed by `actions.sendEmail` (BotID + honeypot intact).
 */
const ContactForm = () => {
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<SentNote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const honeypotRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const customTopicRef = useRef<HTMLInputElement>(null);

  const dictation = useDictation({
    onTranscript: (spoken) => {
      setMessage((current) => {
        const typed = current.trim();

        return (typed ? `${typed} ${spoken}` : spoken).slice(0, MAX_MESSAGE);
      });
      setError(null);
      requestAnimationFrame(() => textareaRef.current?.focus());
    },
  });

  useEffect(() => {
    if (notes.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [notes.length]);

  const handleSelectTopic = (next: Topic) => {
    setTopic(next);

    if (next === "Something else") {
      requestAnimationFrame(() => customTopicRef.current?.focus());
    }
  };

  const send = () => {
    if (pending) {
      return;
    }

    const problem = validateFields({ email, message, name });

    if (problem) {
      setError(problem);

      return;
    }

    dictation.cancel();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    const resolvedTopic =
      topic === "Something else" && customTopic.trim()
        ? customTopic.trim()
        : topic;

    const payload = new FormData();
    payload.set("name", cleanName);
    payload.set("email", cleanEmail);
    payload.set("subject", resolvedTopic);
    payload.set("message", cleanMessage);
    payload.set("projectMilestone", honeypotRef.current?.value ?? "");

    startTransition(async () => {
      try {
        const result = await actions.sendEmail(payload);

        if (result.error) {
          setError(
            result.error.message || "That didn't send. Please try again."
          );

          return;
        }

        setNotes((current) => [
          ...current,
          {
            email: cleanEmail,
            id: Date.now(),
            text: cleanMessage,
            topic: resolvedTopic,
          },
        ]);
        setMessage("");
      } catch {
        setError("That didn't send. Try again, or copy my email above.");
      }
    });
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    send();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  const hint = statusHint({
    error,
    listening: dictation.listening,
    transcribing: dictation.transcribing,
    voiceError: dictation.error,
  });

  return (
    <div className="max-w-[720px] overflow-hidden rounded-[22px] bg-[var(--raised)] shadow-[0_24px_60px_-32px_var(--shadow),inset_0_0_0_1px_rgb(128_128_128/0.14)]">
      <div className="flex items-center gap-3 px-5 py-4">
        <span
          aria-hidden="true"
          className="inline-grid size-9 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--fg)]"
        >
          AJ
        </span>
        <p className="text-[15px] font-medium text-[var(--fg)]">
          Anderson Joseph
        </p>
      </div>

      <div
        aria-live="polite"
        className="max-h-[340px] overflow-y-auto px-5 py-5"
      >
        <SentThread notes={notes} />
        <div ref={endRef} />
      </div>

      <form className="grid gap-3.5 p-5" noValidate onSubmit={handleSubmit}>
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
            ref={honeypotRef}
            tabIndex={-1}
            type="text"
          />
        </div>

        <SenderFields
          email={email}
          id={id}
          name={name}
          onEmailChange={(value) => {
            setEmail(value);
            setError(null);
          }}
          onNameChange={(value) => {
            setName(value);
            setError(null);
          }}
        />

        <TopicSelector
          customTopic={customTopic}
          customTopicRef={customTopicRef}
          id={id}
          onCustomChange={setCustomTopic}
          onSelect={handleSelectTopic}
          selected={topic}
        />

        <MessageBar
          hasNotes={notes.length > 0}
          id={id}
          listening={dictation.listening}
          message={message}
          onChange={(value) => {
            setMessage(value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onToggleVoice={() => dictation.toggle()}
          pending={pending}
          textareaRef={textareaRef}
          transcribing={dictation.transcribing}
          voiceSupported={dictation.supported}
        />

        {hint && (
          <p
            aria-live="polite"
            className={cn(
              "px-1 text-[13.5px]",
              error || dictation.error
                ? "text-[var(--fg)]"
                : "text-[var(--mute)]"
            )}
            role={error || dictation.error ? "alert" : undefined}
          >
            {hint}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
