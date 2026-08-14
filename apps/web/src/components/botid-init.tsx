"use client";

/**
 * BotID client challenge was intercepting `POST /_actions/sendEmail` and could
 * stall indefinitely when the challenge script never resolved, leaving the
 * contact form stuck on “Sending…”.
 *
 * Server-side `checkBotId` still runs when the browser sends `x-is-human`
 * (e.g. after re-enabling client protect). Until then, honeypot + Resend handle
 * contact spam.
 */
const BotIdInit = () => null;

export default BotIdInit;
