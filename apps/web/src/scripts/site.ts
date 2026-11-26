/**
 * The site's small behaviours, in plain TypeScript: no framework on the
 * pages that don't need one. Everything re-runs on `astro:page-load`, so it
 * survives view transitions, and page listeners are dropped before the next
 * swap.
 */

import Lenis from "lenis";

import "lenis/dist/lenis.css";
import {
  SPOTIFY_POLLING_INTERVAL_PAUSED,
  SPOTIFY_POLLING_INTERVAL_PLAYING,
} from "../lib/constants";

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COPIED_MS = 1800;
const CLOCK_MS = 20_000;
const HINT_MS = 2600;
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

/* ---------- theme: system -> light -> dark ---------- */

type ThemeMode = "dark" | "light" | "system";

const THEME_CYCLE: readonly ThemeMode[] = ["system", "light", "dark"];

const THEME_LABEL: Record<ThemeMode, string> = {
  dark: "Theme: Dark (click for System)",
  light: "Theme: Light (click for Dark)",
  system: "Theme: System (click for Light)",
};

const readThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem("andy-theme");

    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Private mode: fall back to system.
  }

  return "system";
};

const initTheme = () => {
  const buttons = $$<HTMLButtonElement>("[data-theme-toggle]");

  if (buttons.length === 0) {
    return;
  }

  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const apply = (mode: ThemeMode) => {
    const root = document.documentElement;

    const isDark = mode === "dark" || (mode === "system" && darkScheme.matches);

    root.dataset.themeMode = mode;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);

    const label = THEME_LABEL[mode];

    for (const button of buttons) {
      button.setAttribute("aria-label", label);
      button.title = label;
    }
  };

  let current = readThemeMode();
  apply(current);

  const cycle = () => {
    const nextIndex = (THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length;
    current = THEME_CYCLE[nextIndex] ?? "system";
    apply(current);

    try {
      localStorage.setItem("andy-theme", current);
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  };

  for (const button of buttons) {
    button.addEventListener("click", cycle, { signal: page.signal });
  }

  darkScheme.addEventListener(
    "change",
    () => {
      if (current === "system") {
        apply("system");
      }
    },
    { signal: page.signal }
  );
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

  let timer = 0;

  const schedule = (playing: boolean) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(
      () => {
        if (document.visibilityState === "visible") {
          void draw();
        }
      },
      playing
        ? SPOTIFY_POLLING_INTERVAL_PLAYING
        : SPOTIFY_POLLING_INTERVAL_PAUSED
    );
  };

  const draw = async () => {
    let playing = false;

    try {
      const response = await fetch("/api/spotify/now-playing", {
        cache: "no-store",
      });

      // SAFETY: our own /api/spotify/now-playing route returns this shape, and every field is checked before it's used.
      const track = (await response.json()) as NowPlaying;

      if (!(response.ok && track.name)) {
        line.hidden = true;
        schedule(false);

        return;
      }

      playing = Boolean(track.isPlaying);

      const arts = $$<HTMLImageElement>("[data-np-art]", line);
      const links = $$<HTMLAnchorElement>("[data-np-link]", line);
      const label = $("[data-np-label]", line);
      const title = $("[data-np-track]", line);
      const artist = $("[data-np-artist]", line);

      for (const art of arts) {
        art.hidden = !track.albumArtUrl;
        art.src = track.albumArtUrl ?? "";
      }

      if (
        track.external_urls?.spotify?.startsWith("https://open.spotify.com/")
      ) {
        for (const link of links) {
          link.href = track.external_urls.spotify;
        }
      }

      if (label) {
        label.textContent = playing ? "Now playing" : "Last played";
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

      line.toggleAttribute("data-playing", playing);
      line.hidden = false;
      line.classList.add("in");
      requestAnimationFrame(() => {
        delete line.dataset.state;
      });
    } catch {
      line.hidden = true;
    }

    schedule(playing);
  };

  void draw();

  const onVisible = () => {
    if (document.visibilityState === "visible") {
      void draw();
    }
  };

  document.addEventListener("visibilitychange", onVisible, {
    signal: page.signal,
  });
  window.addEventListener("focus", onVisible, { signal: page.signal });
  page.signal.addEventListener("abort", () => window.clearTimeout(timer));
};

/* ---------- home & projects: sticky stacking cards (transform + opacity only) ---------- */

const STORY_WIDE = "(min-width: 900px)";
const STACK_OFFSET_PX = 16;
const STACK_SCALE_STEP = 0.042;
const STACK_MIN_SCALE = 0.84;
const STACK_Y_STEP = 6;
const STACK_MAX_Y = 24;
const STACK_DIM_STEP = 0.15;
const STACK_MIN_DIM = 0.45;

const initProjectStack = () => {
  const stack = $("[data-proj-stack]");

  if (!stack) {
    return;
  }

  const cards = $$<HTMLElement>(".proj-card", stack);

  if (cards.length <= 1) {
    return;
  }

  const wide = window.matchMedia(STORY_WIDE);

  const reset = () => {
    for (const card of cards) {
      card.style.removeProperty("--stack-scale");
      card.style.removeProperty("--stack-y");
      card.style.removeProperty("--stack-dim");
    }
  };

  const update = () => {
    if (!wide.matches || reduceMotion()) {
      reset();

      return;
    }

    const tops = cards.map((card) => card.getBoundingClientRect().top);

    for (const [i, card] of cards.entries()) {
      const cardTop = tops[i] ?? 0;
      const span = Math.max(1, card.offsetHeight - STACK_OFFSET_PX);
      let depth = 0;

      for (let j = i + 1; j < cards.length; j += 1) {
        const distance = (tops[j] ?? cardTop) - cardTop;

        if (distance < span + STACK_OFFSET_PX) {
          depth += Math.min(
            1,
            Math.max(0, 1 - (distance - STACK_OFFSET_PX) / span)
          );
        }
      }

      const scale = Math.max(STACK_MIN_SCALE, 1 - depth * STACK_SCALE_STEP);
      const lift = -Math.min(STACK_MAX_Y, depth * STACK_Y_STEP);
      const dim = Math.max(STACK_MIN_DIM, 1 - depth * STACK_DIM_STEP);

      card.style.setProperty("--stack-scale", scale.toFixed(4));
      card.style.setProperty("--stack-y", `${lift.toFixed(2)}px`);
      card.style.setProperty("--stack-dim", dim.toFixed(3));
    }
  };

  wide.addEventListener("change", update, { signal: page.signal });
  onScroll(update);
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

/* ---------- galleries: click next/prev, pick a thumbnail, or use arrow keys ---------- */

const initGallery = (viewer: HTMLElement) => {
  const slides = $$<HTMLElement>("[data-gal-slide]", viewer);
  const thumbs = $$<HTMLButtonElement>("[data-gal-pick]", viewer);
  const caption = $("[data-gal-cap]", viewer);
  const counter = $("[data-gal-count]", viewer);

  if (slides.length <= 1) {
    return;
  }

  let current = 0;

  const show = (nextIndex: number) => {
    const total = slides.length;
    const index = ((nextIndex % total) + total) % total;
    current = index;

    for (const [i, slide] of slides.entries()) {
      slide.hidden = i !== index;
    }

    for (const [i, thumb] of thumbs.entries()) {
      const active = i === index;
      thumb.classList.toggle("on", active);
      thumb.setAttribute("aria-selected", String(active));
    }

    const activeCaption =
      slides[index]?.querySelector("figcaption")?.textContent ?? "";

    if (caption) {
      caption.textContent = activeCaption;
    }

    if (counter) {
      counter.textContent = `${index + 1} / ${total}`;
    }
  };

  const stepBy = (delta: number) => show(current + delta);

  for (const button of $$<HTMLButtonElement>("[data-gal-step]", viewer)) {
    const delta = Number(button.dataset.galStep);
    button.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
        stepBy(delta);
      },
      { signal: page.signal }
    );
  }

  for (const thumb of thumbs) {
    const targetIndex = Number(thumb.dataset.galPick);
    thumb.addEventListener("click", () => show(targetIndex), {
      signal: page.signal,
    });
  }

  viewer.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepBy(-1);
      }
    },
    { signal: page.signal }
  );
};

const initGalleries = () => {
  for (const viewer of $$("[data-gallery]")) {
    initGallery(viewer);
  }
};

/* ---------- click to zoom: pictures in blog posts and case studies ---------- */

/** Pictures inside the writing and the galleries. Header pictures stay put. */
const ZOOMABLE = ".prose img, .gal-stage .fig > img";

/** A picture's caption: its figure's, or the italic line right under it in a post. */
const captionFor = (image: HTMLImageElement) => {
  const figure = image.closest("figure")?.querySelector("figcaption");

  if (figure) {
    return figure.textContent ?? "";
  }

  const next = image.closest("p")?.nextElementSibling;

  return next?.matches("p:has(> em:only-child)")
    ? (next.textContent ?? "")
    : "";
};

const initZoom = () => {
  const view = $<HTMLDialogElement>("[data-zoom]");
  const big = $<HTMLImageElement>("[data-zoom-img]");
  const caption = $("[data-zoom-cap]");
  const closer = $<HTMLButtonElement>("[data-zoom-close]");

  if (!(view && big && caption && closer)) {
    return;
  }

  const { signal } = page;

  const open = (image: HTMLImageElement) => {
    big.src = image.currentSrc || image.src;
    big.alt = image.alt;
    caption.textContent = captionFor(image);
    view.showModal();
    lenis?.stop();
    document.body.style.overflow = "hidden";
  };

  for (const image of $$<HTMLImageElement>(ZOOMABLE)) {
    image.classList.add("zoomable");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.addEventListener("click", () => open(image), { signal });
    image.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(image);
        }
      },
      { signal }
    );
  }

  // Anywhere outside the button closes it: the picture, its caption, the dim.
  view.addEventListener("click", () => view.close(), { signal });

  view.addEventListener(
    "close",
    () => {
      lenis?.start();
      document.body.style.overflow = "";
      big.removeAttribute("src");
    },
    { signal }
  );

  signal.addEventListener("abort", () => {
    if (view.open) {
      view.close();
    }
  });
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

/* ---------- smooth scroll: Lenis, tuned as on the old site ---------- */

const SCROLL_DURATION = 1.2;
let lenis: Lenis | null = null;
let lenisFrame = 0;

const scrollTick = (time: number) => {
  lenis?.raf(time);
  lenisFrame = requestAnimationFrame(scrollTick);
};

const stopSmoothScroll = () => {
  cancelAnimationFrame(lenisFrame);
  lenis?.destroy();
  lenis = null;
};

/** The AI page scrolls its own conversation, so it keeps native scrolling. */
const initSmoothScroll = () => {
  const wanted = !reduceMotion() && !location.pathname.startsWith("/ai");

  if (!wanted) {
    stopSmoothScroll();

    return;
  }

  if (lenis) {
    lenis.resize();

    return;
  }

  lenis = new Lenis({
    duration: SCROLL_DURATION,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });
  lenisFrame = requestAnimationFrame(scrollTick);
};

/* ---------- scroll reveals: things rise in as they arrive ---------- */

/** What rises in. Pages keep their markup; the list lives here. */
const REVEAL = [
  ".hero > *",
  ".head",
  ".pr",
  ".lists > *",
  ".says",
  ".belief",
  ".chapter",
  ".arow",
  ".cs-head > *",
  ".cs-why",
  ".step",
  ".ba",
  ".gal-viewer",
  ".cs-next",
  ".prow",
  ".post-fig",
  ".site-foot .cta > *",
].join(",");

const REVEAL_STAGGER = 6;

const initReveal = () => {
  const items = $$(REVEAL);

  if (!document.documentElement.classList.contains("motion")) {
    for (const item of items) {
      item.classList.add("in");
    }

    return;
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      const arriving = entries.filter((entry) => entry.isIntersecting);

      for (const [order, entry] of arriving.entries()) {
        const item = entry.target;

        if (item instanceof HTMLElement) {
          item.style.setProperty(
            "--rv",
            String(Math.min(order, REVEAL_STAGGER))
          );
          item.classList.add("in");
        }

        watcher.unobserve(item);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  for (const item of items) {
    watcher.observe(item);
  }

  page.signal.addEventListener("abort", () => watcher.disconnect());
};

/* ---------- phone menu: the full-screen one from the old site ---------- */

const MENU_MS = 200;

/** Tab and Shift+Tab wrap around inside `box` instead of leaving it. */
const keepFocusIn = (box: HTMLElement, event: KeyboardEvent) => {
  const stops = $$<HTMLElement>("a[href], button:not([disabled])", box);
  const [first] = stops;
  const last = stops.at(-1);

  if (!(first && last)) {
    return;
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const initMenu = () => {
  const menu = $("[data-menu]");
  const opener = $<HTMLButtonElement>("[data-menu-open]");
  const closer = $<HTMLButtonElement>("[data-menu-close]");

  if (!(menu && opener && closer)) {
    return;
  }

  const { signal } = page;
  let timer = 0;

  const open = () => {
    window.clearTimeout(timer);
    menu.hidden = false;
    opener.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    lenis?.stop();
    nextFrame(() => menu.classList.add("open"));
    closer.focus();
  };

  const close = () => {
    menu.classList.remove("open");
    opener.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    lenis?.start();
    timer = window.setTimeout(
      () => {
        menu.hidden = true;
      },
      reduceMotion() ? 0 : MENU_MS
    );
  };

  opener.addEventListener("click", open, { signal });
  closer.addEventListener(
    "click",
    () => {
      close();
      opener.focus();
    },
    { signal }
  );

  for (const link of $$("a", menu)) {
    link.addEventListener("click", close, { signal });
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (menu.hidden) {
        return;
      }

      if (event.key === "Escape") {
        close();
        opener.focus();
      } else if (event.key === "Tab") {
        keepFocusIn(menu, event);
      }
    },
    { signal }
  );

  signal.addEventListener("abort", () => {
    window.clearTimeout(timer);
    document.body.style.overflow = "";
    lenis?.start();
  });
};

/* ---------- wiring ---------- */

const init = () => {
  page.abort();
  page = new AbortController();
  initSmoothScroll();
  initReveal();
  initMenu();
  initTheme();
  initCopy();
  initClock();
  initNowPlaying();
  initProjectStack();
  initRails();
  initBeforeAfter();
  initGalleries();
  initZoom();
  initClips();
  initAsk();
};

document.addEventListener("astro:page-load", init);

document.addEventListener("astro:before-swap", () => page.abort());
