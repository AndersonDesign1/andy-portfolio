/**
 * The site's small behaviours, in plain TypeScript: no framework on the
 * pages that don't need one. Everything re-runs on `astro:page-load`, so it
 * survives view transitions, and page listeners are dropped before the next
 * swap.
 */

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COPIED_MS = 1800;
const CLOCK_MS = 20_000;
const HINT_MS = 2600;
const SPOTIFY_MS = 60_000;
const COUNT_MS = 900;
const SWAP_MS = 600;
const BA_DELAY_MS = 450;
const ASK_SEND_MS = 220;

let page = new AbortController();

const $ = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
) => root.querySelector<T>(selector);

const $$ = <T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document
) => [...root.querySelectorAll<T>(selector)];

const nextFrame = (run: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(run));

/** Calls `run` on scroll and resize (once a frame at most) until the page swaps. */
const onScroll = (run: () => void) => {
  let queued = false;

  const tick = () => {
    if (queued) {
      return;
    }

    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  };

  window.addEventListener("scroll", tick, {
    passive: true,
    signal: page.signal,
  });
  window.addEventListener("resize", tick, { signal: page.signal });
  run();
};

/** The index of the last element whose top has passed `line` (a share of the viewport). */
const passed = (elements: HTMLElement[], line: number) => {
  const y = window.innerHeight * line;
  let index = 0;

  for (const [i, element] of elements.entries()) {
    if (element.getBoundingClientRect().top < y) {
      index = i;
    }
  }

  return index;
};

/** Swaps the text in a clipped box: the old value slides out, the new one in. */
const swapText = (box: HTMLElement, text: string, direction: 1 | -1) => {
  const old = box.querySelector<HTMLElement>("span:last-child");

  if (!old || reduceMotion()) {
    if (old) {
      old.textContent = text;
    }

    return;
  }

  const next = document.createElement("span");
  next.textContent = text;
  next.style.transform = `translateY(${direction * 100}%)`;
  next.style.opacity = "0";
  box.append(next);
  nextFrame(() => {
    next.style.transform = "none";
    next.style.opacity = "1";
    old.style.transform = `translateY(${-direction * 100}%)`;
    old.style.opacity = "0";
  });
  window.setTimeout(() => old.remove(), SWAP_MS);
};

/* ---------- theme ---------- */

const initTheme = () => {
  for (const button of $$("[data-theme-toggle]")) {
    button.addEventListener(
      "click",
      () => {
        const root = document.documentElement;
        const dark = !root.classList.contains("dark");
        root.classList.toggle("dark", dark);
        root.classList.toggle("light", !dark);

        try {
          localStorage.setItem("andy-theme", dark ? "dark" : "light");
        } catch {
          // Private mode: the choice lasts for this page only.
        }
      },
      { signal: page.signal }
    );
  }
};

/* ---------- copy email ---------- */

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return false;
  }
};

const initCopy = () => {
  for (const button of $$<HTMLButtonElement>("[data-copy]")) {
    const label = $(".lbl", button);
    let timer = 0;

    button.addEventListener(
      "click",
      async () => {
        const text = button.dataset.copy ?? "";

        if (!(await copyText(text))) {
          window.location.href = `mailto:${text}`;

          return;
        }

        window.clearTimeout(timer);
        button.classList.add("done");

        if (label) {
          label.textContent = "Copied";
        }

        timer = window.setTimeout(() => {
          button.classList.remove("done");

          if (label) {
            label.textContent = "Copy email";
          }
        }, COPIED_MS);
      },
      { signal: page.signal }
    );
  }
};

/* ---------- footer clock: the time in Nigeria ---------- */

const lagosTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

const initClock = () => {
  const clocks = $$("[data-lagos-clock]");

  if (clocks.length === 0) {
    return;
  }

  const draw = () => {
    const now = new Date();
    const text = lagosTime.format(now);

    for (const clock of clocks) {
      clock.textContent = text;
      clock.setAttribute("datetime", now.toISOString());
    }
  };

  draw();
  const timer = window.setInterval(draw, CLOCK_MS);
  page.signal.addEventListener("abort", () => window.clearInterval(timer));
};

/* ---------- Spotify: one quiet line ---------- */

interface NowPlaying {
  albumArtUrl?: string | null;
  artists?: { name?: string }[];
  external_urls?: { spotify?: string };
  isPlaying?: boolean;
  name?: string;
}

const initNowPlaying = () => {
  const line = $("[data-now-playing]");

  if (!line) {
    return;
  }

  const draw = async () => {
    try {
      const response = await fetch("/api/spotify/now-playing", {
        cache: "no-store",
      });

      // SAFETY: our own /api/spotify/now-playing route returns this shape, and every field is checked before it's used.
      const track = (await response.json()) as NowPlaying;

      if (!(response.ok && track.name)) {
        line.hidden = true;

        return;
      }

      const art = $<HTMLImageElement>("img", line);
      const link = $<HTMLAnchorElement>("[data-np-link]", line);
      const label = $("[data-np-label]", line);
      const title = $("[data-np-track]", line);
      const artist = $("[data-np-artist]", line);

      if (art) {
        art.hidden = !track.albumArtUrl;
        art.src = track.albumArtUrl ?? "";
      }

      if (
        link &&
        track.external_urls?.spotify?.startsWith("https://open.spotify.com/")
      ) {
        link.href = track.external_urls.spotify;
      }

      if (label) {
        label.textContent = track.isPlaying ? "On repeat" : "Last played";
      }

      if (title) {
        title.textContent = track.name;
      }

      if (artist) {
        const names = (track.artists ?? []).flatMap((entry) =>
          entry.name ? [entry.name] : []
        );

        artist.textContent = names.join(", ") || "someone";
      }

      line.toggleAttribute("data-playing", Boolean(track.isPlaying));
      line.hidden = false;
      requestAnimationFrame(() => {
        delete line.dataset.state;
      });
    } catch {
      line.hidden = true;
    }
  };

  void draw();

  const timer = window.setInterval(() => {
    if (document.visibilityState === "visible") {
      void draw();
    }
  }, SPOTIFY_MS);

  page.signal.addEventListener("abort", () => window.clearInterval(timer));
};

/* ---------- home: the work index ---------- */

const initWorkIndex = () => {
  const rows = $("[data-work-rows]");
  const stage = $("[data-work-stage]");

  if (!(rows && stage)) {
    return;
  }

  const rowEls = $$<HTMLAnchorElement>(".row-p", rows);
  const figs = $$(".fig", stage);
  const stack = $("[data-stage-stack]", stage);
  const go = $<HTMLAnchorElement>("[data-stage-go]", stage);
  let active = -1;
  let hovering = false;

  const setActive = (index: number) => {
    if (index === active) {
      return;
    }

    active = index;

    for (const [i, row] of rowEls.entries()) {
      row.classList.toggle("on", i === index);
    }

    for (const [i, fig] of figs.entries()) {
      fig.classList.toggle("on", i === index);
    }

    const row = rowEls[index];

    if (stack && row) {
      stack.textContent = row.dataset.stack ?? "";
    }

    if (go && row) {
      go.href = row.href;
      go.target = row.target;
      go.rel = row.rel;
      const label = $(".u", go);

      if (label) {
        label.textContent = row.dataset.go ?? "See it";
      }
    }
  };

  rows.classList.add("live");
  setActive(0);

  const enter = (index: number) => {
    hovering = true;
    setActive(index);
  };

  for (const [i, row] of rowEls.entries()) {
    row.addEventListener("mouseenter", () => enter(i), {
      signal: page.signal,
    });
    row.addEventListener("focus", () => setActive(i), { signal: page.signal });
  }

  rows.addEventListener(
    "mouseleave",
    () => {
      hovering = false;
    },
    { signal: page.signal }
  );

  onScroll(() => {
    if (hovering) {
      return;
    }

    const middle = window.innerHeight / 2;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const [i, row] of rowEls.entries()) {
      const box = row.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - middle);

      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }

    setActive(best);
  });
};

/* ---------- a rail of buttons that follows the scroll (About, case studies) ---------- */

const initRails = () => {
  for (const rail of $$("[data-rail]")) {
    const targets = $$(rail.dataset.rail ?? "");
    const buttons = $$<HTMLButtonElement>(".rail-btn", rail);
    const weeks = $$("[data-weeks] > div");
    const year = $("[data-year-num]", rail);
    let current = -1;

    if (targets.length === 0) {
      continue;
    }

    for (const [i, button] of buttons.entries()) {
      button.addEventListener(
        "click",
        () =>
          targets[i]?.scrollIntoView({
            behavior: reduceMotion() ? "auto" : "smooth",
            block: "center",
          }),
        { signal: page.signal }
      );
    }

    const set = (index: number) => {
      if (index === current) {
        return;
      }

      const direction = index > current ? 1 : -1;
      current = index;

      for (const [i, button] of buttons.entries()) {
        button.classList.toggle("on", i === index);
        button.setAttribute("aria-current", i === index ? "step" : "false");
      }

      for (const [i, week] of weeks.entries()) {
        week.classList.toggle("on", i <= index);
      }

      const label = targets[index]?.dataset.year;

      if (year && label && year.textContent?.trim() !== label) {
        swapText(year, label, direction);
      }
    };

    onScroll(() =>
      set(passed(targets, rail.dataset.line ? Number(rail.dataset.line) : 0.45))
    );
  }
};

/* ---------- case study: before and after ---------- */

const NUMBER = /^(?<num>\d[\d,.]*)(?<suffix>.*)$/u;

const parseNumber = (value: string) => {
  const groups = NUMBER.exec(value.trim())?.groups;

  if (!groups?.num) {
    return null;
  }

  return {
    suffix: groups.suffix ?? "",
    value: Number(groups.num.replaceAll(",", "")),
  };
};

const initBeforeAfter = () => {
  const box = $("[data-ba]");

  if (!box) {
    return;
  }

  const buttons = $$<HTMLButtonElement>(".seg button", box);
  const values = $$("[data-before]", box);
  let flipped = false;

  const show = (side: "after" | "before") => {
    if (box.dataset.v === side) {
      return;
    }

    box.dataset.v = side;

    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.v === side));
    }

    const direction = side === "after" ? 1 : -1;

    for (const value of values) {
      const from = value.dataset[side === "after" ? "before" : "after"] ?? "";
      const to = value.dataset[side] ?? "";
      const start = parseNumber(from);
      const end = parseNumber(to);
      const span = value.querySelector<HTMLElement>("span:last-child");

      // Two numbers with the same unit count up or down; anything else slides.
      if (
        start &&
        end &&
        start.suffix === end.suffix &&
        span &&
        !reduceMotion()
      ) {
        const began = performance.now();

        const step = (now: number) => {
          const t = Math.min(1, (now - began) / COUNT_MS);
          const eased = 1 - (1 - t) ** 3;
          span.textContent = `${Math.round(start.value + (end.value - start.value) * eased)}${end.suffix}`;

          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            span.textContent = to;
          }
        };

        requestAnimationFrame(step);
        continue;
      }

      swapText(value, to, direction);
    }
  };

  const pick = (button: HTMLElement) => {
    flipped = true;
    show(button.dataset.v === "after" ? "after" : "before");
  };

  for (const button of buttons) {
    button.addEventListener("click", () => pick(button), {
      signal: page.signal,
    });
  }

  // The first time the numbers scroll into view, they flip to "after" by themselves.
  onScroll(() => {
    if (flipped) {
      return;
    }

    const rect = box.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.7 && rect.bottom > 0) {
      flipped = true;
      window.setTimeout(() => show("after"), reduceMotion() ? 0 : BA_DELAY_MS);
    }
  });
};

/* ---------- galleries: swipe, or use the arrows ---------- */

const initGalleries = () => {
  for (const nav of $$("[data-gal-nav]")) {
    const strip = $(nav.dataset.galNav ?? "");

    if (!strip) {
      continue;
    }

    for (const button of $$<HTMLButtonElement>("button", nav)) {
      button.addEventListener(
        "click",
        () =>
          strip.scrollBy({
            behavior: reduceMotion() ? "auto" : "smooth",
            left: Number(button.dataset.g) * strip.clientWidth * 0.8,
          }),
        { signal: page.signal }
      );
    }
  }
};

/* ---------- looping clips: play only on screen, never with reduced motion ---------- */

const initClips = () => {
  const clips = $$<HTMLVideoElement>("video[data-autoplay]");

  if (clips.length === 0) {
    return;
  }

  if (reduceMotion()) {
    for (const clip of clips) {
      clip.removeAttribute("autoplay");
      clip.pause();
      clip.controls = true;
    }

    return;
  }

  const watcher = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const clip = entry.target;

      if (!(clip instanceof HTMLVideoElement)) {
        continue;
      }

      if (entry.isIntersecting) {
        void clip.play().catch(() => {
          clip.controls = true;
        });
      } else {
        clip.pause();
      }
    }
  });

  for (const clip of clips) {
    watcher.observe(clip);
  }

  page.signal.addEventListener("abort", () => watcher.disconnect());
};

/* ---------- Ask pill ---------- */

const initAsk = () => {
  const ask = $("[data-ask]");

  if (!ask) {
    return;
  }

  const opener = $<HTMLButtonElement>("[data-ask-open]", ask);
  const form = $<HTMLFormElement>("[data-ask-form]", ask);
  const field = $<HTMLTextAreaElement>("textarea", ask);
  const send = $<HTMLButtonElement>(".ask-send", ask);
  const hint = $("[data-ask-hint]", ask);
  const suggestions = $$<HTMLButtonElement>(".sugg button", ask);

  if (!(opener && form && field && send)) {
    return;
  }

  const open = () => {
    ask.classList.add("open");
    opener.setAttribute("aria-expanded", "true");
    window.setTimeout(() => field.focus(), 180);
  };

  const close = (refocus = false) => {
    ask.classList.remove("open", "sending");
    opener.setAttribute("aria-expanded", "false");

    if (refocus) {
      opener.focus();
    }
  };

  const sync = () => {
    send.disabled = field.value.trim().length === 0;
  };

  const { signal } = page;
  opener.addEventListener("click", open, { signal });
  $("[data-ask-close]", ask)?.addEventListener("click", () => close(true), {
    signal,
  });
  field.addEventListener("input", sync, { signal });
  field.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (field.value.trim()) {
          form.requestSubmit();
        }
      }
    },
    { signal }
  );

  for (const suggestion of suggestions) {
    suggestion.addEventListener(
      "click",
      () => {
        field.value = suggestion.textContent ?? "";
        sync();
        field.focus();
      },
      { signal }
    );
  }

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      const question = field.value.trim();

      if (!question) {
        return;
      }

      ask.classList.add("sending");
      window.setTimeout(
        () => {
          window.location.assign(`/ai?q=${encodeURIComponent(question)}`);
        },
        reduceMotion() ? 0 : ASK_SEND_MS
      );
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      const target = event.target instanceof HTMLElement ? event.target : null;

      const typing =
        target?.isContentEditable ||
        ["INPUT", "SELECT", "TEXTAREA"].includes(target?.tagName ?? "");

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        open();
      }

      if (event.key === "Escape" && ask.classList.contains("open")) {
        close(true);
      }
    },
    { signal }
  );

  document.addEventListener(
    "click",
    (event) => {
      if (
        ask.classList.contains("open") &&
        event.target instanceof Node &&
        !ask.contains(event.target)
      ) {
        close();
      }
    },
    { signal }
  );

  if (hint) {
    let index = 1;

    const timer = window.setInterval(() => {
      if (!ask.matches(":hover")) {
        index = (index + 1) % suggestions.length;
        hint.textContent = suggestions[index]?.textContent ?? "";
      }
    }, HINT_MS);

    signal.addEventListener("abort", () => window.clearInterval(timer));
  }
};

/* ---------- wiring ---------- */

const init = () => {
  page.abort();
  page = new AbortController();
  initTheme();
  initCopy();
  initClock();
  initNowPlaying();
  initWorkIndex();
  initRails();
  initBeforeAfter();
  initGalleries();
  initClips();
  initAsk();
};

document.addEventListener("astro:page-load", init);

document.addEventListener("astro:before-swap", () => page.abort());
