"use client";

import { initBotId } from "botid/client/core";
import { useEffect } from "react";

// Astro Actions post to `/_actions/<name>`, not the page URL.
// Next.js Server Actions posted to `/contact` — that protect path must not be reused here.
const BotIdInit = () => {
  useEffect(() => {
    initBotId({
      protect: [
        {
          advancedOptions: { checkLevel: "basic" },
          method: "POST",
          path: "/_actions/sendEmail",
        },
      ],
    });
  }, []);
  return null;
};

export default BotIdInit;
