import { neon } from "@neon/ai-sdk-provider";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { generateText, LanguageModel } from "ai";
import type { AddendumKey } from "./prompts.ts";

export type ProviderOptions = Parameters<
  typeof generateText
>[0]["providerOptions"];

export type Provider = "neon" | "openrouter";

/** USD per 1M tokens. Checked 2026-11-16 against neon.com/models.json and openrouter.ai/api/v1/models. */
export interface Price {
  input: number;
  cacheRead: number;
  cacheWrite?: number;
  output: number;
}

export interface ModelProfile {
  key: string;
  provider: Provider;
  modelId: string;
  price: Price;
  addendum?: AddendumKey;
  /** Hidden thinking counts against this, so leave room above the ~150-word reply. */
  maxOutputTokens: number;
  providerOptions?: ProviderOptions;
  create: () => LanguageModel;
}

let openrouterClient: ReturnType<typeof createOpenRouter> | undefined;

function openrouter() {
  openrouterClient ??= createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  return openrouterClient;
}

const openrouterOptions = (): ProviderOptions => ({
  openrouter: {
    reasoning: { effort: "low" },
    // Report billed cost per request.
    usage: { include: true },
    // Cheapest host. Without this, OpenRouter's load balancing billed GLM 2.5x list price in testing.
    provider: { sort: "price" },
  },
});

export const MODELS = {
  luna: {
    key: "luna",
    provider: "neon",
    modelId: "gpt-6-luna",
    price: { input: 0.1, cacheRead: 0.01, output: 0.5 },
    addendum: "luna",
    maxOutputTokens: 1200,
    providerOptions: { openai: { reasoningEffort: "low" } },
    create: () => neon("gpt-6-luna"),
  },
  haiku: {
    key: "haiku",
    provider: "neon",
    modelId: "claude-haiku-5-5",
    price: { input: 0.1, cacheRead: 0.01, cacheWrite: 0.125, output: 0.5 },
    addendum: "haiku",
    maxOutputTokens: 1200,
    create: () => neon("claude-haiku-5-5"),
  },
  deepseek: {
    key: "deepseek",
    provider: "openrouter",
    modelId: "deepseek/deepseek-v4.1-flash-1017",
    price: { input: 0.006, cacheRead: 0.005, output: 0.5 },
    addendum: "deepseek",
    maxOutputTokens: 1200,
    providerOptions: openrouterOptions(),
    create: () => openrouter().chat("deepseek/deepseek-v4.1-flash-1017"),
  },
  glm: {
    key: "glm",
    provider: "openrouter",
    modelId: "z-ai/glm-5.3-flash",
    price: { input: 0.0399, cacheRead: 0.03, output: 0.0784 },
    addendum: "glmStrict",
    maxOutputTokens: 1500,
    providerOptions: openrouterOptions(),
    create: () => openrouter().chat("z-ai/glm-5.3-flash"),
  },
} satisfies Record<string, ModelProfile>;

export type ModelKey = keyof typeof MODELS;

/**
 * Fallback order. Neon credit is spent first; OpenRouter takes over when Neon
 * errors, is slow, is rate limited, or its budget is used up.
 * Homework messages go to the models that best kept the no-solutions rule
 * (Haiku and DeepSeek: 0 leaks; Luna: 1 single-line; GLM with its strict prompt: 1 in 12).
 * GLM is the last resort on both routes: cheapest, but the weakest on homework.
 */
export const ROUTES: Record<"general" | "homework", ModelKey[]> = {
  general: ["luna", "haiku", "deepseek", "glm"],
  homework: ["haiku", "luna", "deepseek", "glm"],
};

export function estimateCost(price: Price, usage: UsageCounts): number {
  const fresh = Math.max(0, usage.input - usage.cacheRead - usage.cacheWrite);

  return (
    (fresh * price.input +
      usage.cacheRead * price.cacheRead +
      usage.cacheWrite * (price.cacheWrite ?? price.input) +
      usage.output * price.output) /
    1e6
  );
}

export interface UsageCounts {
  input: number;
  cacheRead: number;
  cacheWrite: number;
  output: number;
  reasoning: number;
}
