"use client";

import { initBotId } from "botid/client/core";
import { useEffect } from "react";

export default function BotIdInit() {
  useEffect(() => {
    initBotId({
      protect: [{ method: "POST", path: "/contact" }],
    });
  }, []);
  return null;
}
