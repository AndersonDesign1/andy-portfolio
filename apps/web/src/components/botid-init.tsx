"use client";

import { initBotId } from "botid/client/core";
import { useEffect } from "react";

const BotIdInit = () => {
  useEffect(() => {
    initBotId({
      protect: [{ method: "POST", path: "/contact" }],
    });
  }, []);
  return null;
};

export default BotIdInit;
