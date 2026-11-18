import { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";

let store: PostgresBudgetStore | undefined;

/** One Neon HTTP client per instance, shared by the tutor, rate limits and shared chats. */
export const getTutorStore = (databaseUrl: string): PostgresBudgetStore => {
  store ??= new PostgresBudgetStore(databaseUrl);

  return store;
};
