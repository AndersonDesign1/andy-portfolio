"use client";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { m } from "motion/react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import MotionRoot from "@/components/motion-root";
import { ANIMATION_EASE_CUBIC } from "@/lib/constants";
import type { CaseStudy, CaseStudyNavigation } from "@/types/case-study";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapDialogFocus = (
  event: KeyboardEvent,
  dialogElement: HTMLDialogElement
) => {
  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = [
    ...dialogElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ];
  const [firstFocusableElement] = focusableElements;
  const lastFocusableElement = focusableElements.at(-1);

  if (!firstFocusableElement || !lastFocusableElement) {
    event.preventDefault();
    dialogElement.focus();
    return;
  }

  const focusIsInsideDialog = dialogElement.contains(document.activeElement);

  if (!focusIsInsideDialog) {
    event.preventDefault();
    (event.shiftKey ? lastFocusableElement : firstFocusableElement).focus();
    return;
  }

  if (event.shiftKey && document.activeElement === firstFocusableElement) {
    event.preventDefault();
    lastFocusableElement.focus();
  } else if (
    !event.shiftKey &&
    document.activeElement === lastFocusableElement
  ) {
    event.preventDefault();
    firstFocusableElement.focus();
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: ANIMATION_EASE_CUBIC,
    },
    y: 0,
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.05 },
  },
};

const CaseStudyHeader = ({ caseStudy }: { caseStudy: CaseStudy }) => (
  <>
    <div className="mx-auto max-w-screen-xl px-6 pb-20 md:px-12">
      <m.div
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
      >
        <a
          className="text-secondary inline-flex items-center gap-2 text-sm transition-opacity duration-300 hover:opacity-70"
          href="/projects"
        >
          <HugeiconsIcon
            color="currentColor"
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={1.5}
          />
          Back to Projects
        </a>

        {caseStudy.hero.liveUrl && (
          <a
            className="text-secondary inline-flex items-center gap-2 text-sm transition-opacity duration-300 hover:opacity-70"
            href={caseStudy.hero.liveUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <HugeiconsIcon
              color="currentColor"
              icon={Globe02Icon}
              size={16}
              strokeWidth={1.5}
            />
            Live Site
          </a>
        )}
      </m.div>
    </div>

    <section className="mx-auto max-w-screen-xl px-4 pb-24 md:px-8 md:pb-32">
      <m.div
        animate="visible"
        className="flex flex-col gap-12 md:gap-24"
        initial="hidden"
        variants={stagger}
      >
        <m.div className="flex flex-col gap-8 md:gap-12" variants={fadeInUp}>
          <div className="border-subtle grid grid-cols-1 border-y md:grid-cols-4">
            <div className="border-subtle flex flex-col gap-2 border-b py-4 md:border-r md:border-b-0 md:py-6">
              <span className="text-muted block font-mono text-xs tracking-widest uppercase">
                Client
              </span>
              <span className="text-secondary text-sm md:text-base">
                {caseStudy.hero.client}
              </span>
            </div>
            <div className="border-subtle flex flex-col gap-2 border-b py-4 md:border-r md:border-b-0 md:py-6 md:pl-8">
              <span className="text-muted block font-mono text-xs tracking-widest uppercase">
                Duration
              </span>
              <span className="text-secondary text-sm md:text-base">
                {caseStudy.hero.duration}
              </span>
            </div>
            <div className="flex flex-col gap-2 py-4 md:col-span-2 md:py-6 md:pl-8">
              <span className="text-muted block font-mono text-xs tracking-widest uppercase">
                Tech
              </span>
              <div className="text-secondary flex flex-wrap gap-x-4 text-sm md:text-base">
                {caseStudy.hero.technologies.slice(0, 4).map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          </div>

          <h1 className="text-primary text-6xl leading-[0.85] font-bold tracking-tighter break-words uppercase md:text-8xl lg:text-9xl">
            {caseStudy.hero.title}
          </h1>

          <p className="text-secondary max-w-2xl self-end text-xl leading-relaxed font-light md:text-2xl">
            {caseStudy.hero.overview}
          </p>
        </m.div>

        <m.div
          animate={{ opacity: 1, scale: 1 }}
          className="border-subtle bg-secondary/5 relative aspect-video w-full border"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: ANIMATION_EASE_CUBIC }}
        >
          <img
            alt={caseStudy.hero.title}
            className="object-contain"
            src={caseStudy.hero.heroImage}
          />
        </m.div>
      </m.div>
    </section>
  </>
);

const CaseStudyContent = ({
  caseStudy,
  navigation,
  onSelectImage,
}: {
  caseStudy: CaseStudy;
  navigation?: CaseStudyNavigation;
  onSelectImage: (src: string, trigger: HTMLButtonElement) => void;
}) => (
  <>
    <section className="border-subtle border-t">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid min-h-[50vh] grid-cols-1 md:grid-cols-12">
          <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
            <h2 className="text-muted sticky top-32 font-mono text-xs tracking-widest uppercase">
              01 — The Challenge
            </h2>
          </div>

          <div className="flex flex-col gap-16 py-12 md:col-span-8 md:py-24 md:pl-12">
            <div className="flex flex-col gap-8">
              <h3 className="text-primary text-3xl leading-tight font-medium md:text-4xl">
                {caseStudy.challenge.problem}
              </h3>
              <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2">
                <div>
                  <h4 className="text-muted pb-4 font-mono text-sm uppercase">
                    Constraints
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {caseStudy.challenge.constraints.map((constraint) => (
                      <li
                        className="border-subtle text-secondary border-l py-1 pl-4 text-sm"
                        key={constraint}
                      >
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-muted pb-4 font-mono text-sm uppercase">
                    Goals
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {caseStudy.goals.primary.map((goal) => (
                      <li
                        className="border-subtle text-secondary border-l py-1 pl-4 text-sm"
                        key={goal}
                      >
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-subtle border-t">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
            <h2 className="text-muted sticky top-32 font-mono text-xs tracking-widest uppercase">
              02 — Approach
            </h2>
          </div>
          <div className="py-12 md:col-span-8 md:py-24 md:pl-12">
            <p className="text-secondary pb-16 text-xl leading-relaxed">
              {caseStudy.approach.methodology}
            </p>

            <div className="flex flex-col gap-0">
              {caseStudy.approach.phases.map((phase, index) => (
                <div
                  className="group border-subtle hover:bg-secondary/5 border-t py-8 first:border-t-0"
                  key={phase.name}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-primary text-xl font-medium">
                        {phase.name}
                      </h3>
                      <span className="text-muted font-mono text-sm">
                        0{index + 1}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {phase.activities.map((activity) => (
                        <li className="text-secondary text-sm" key={activity}>
                          — {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-subtle border-t border-b">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="border-subtle py-12 md:col-span-4 md:border-r md:py-24">
            <h2 className="text-muted sticky top-32 font-mono text-xs tracking-widest uppercase">
              03 — Impact
            </h2>
          </div>
          <div className="py-12 md:col-span-8 md:py-24 md:pl-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
              {caseStudy.results.beforeAfter.map((metric) => (
                <div className="flex flex-col gap-1" key={metric.metric}>
                  <h3 className="text-muted font-mono text-xs tracking-widest uppercase">
                    {metric.metric}
                  </h3>
                  <div className="flex items-baseline gap-4">
                    <span className="text-primary text-2xl font-bold tracking-tight md:text-4xl">
                      {metric.after}
                    </span>
                  </div>
                  <div className="text-secondary flex items-center gap-2 text-sm">
                    <span className="text-muted decoration-subtle line-through">
                      {metric.before}
                    </span>
                    <HugeiconsIcon
                      className="inline"
                      color="currentColor"
                      icon={ArrowRight01Icon}
                      size={16}
                      strokeWidth={1.5}
                    />
                    <span>Result</span>
                  </div>
                </div>
              ))}
            </div>

            {caseStudy.results.metrics.length > 0 && (
              <div className="border-subtle grid grid-cols-2 gap-8 border-t pt-20">
                {caseStudy.results.metrics.map((metric) => (
                  <p
                    className="border-primary text-primary border-l-2 py-2 pl-6 text-lg font-light"
                    key={metric}
                  >
                    {metric}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <section className="py-24">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <h2 className="text-muted pb-12 font-mono text-xs tracking-widest uppercase">
          Gallery
        </h2>
        <div className="flex flex-col gap-32">
          {caseStudy.gallery.images.map((image, index) => (
            <div className="group flex flex-col gap-4" key={image.src}>
              <button
                className="border-subtle bg-secondary/5 focus-visible:ring-foreground focus-visible:ring-offset-background relative aspect-video w-full cursor-zoom-in touch-manipulation overflow-hidden border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={(event) =>
                  onSelectImage(image.src, event.currentTarget)
                }
                type="button"
              >
                <img
                  alt={image.alt || `Project image ${index + 1}`}
                  className="object-contain transition-transform duration-200 ease-[var(--ease-out)] group-hover:scale-[1.02] motion-reduce:transform-none"
                  loading="lazy"
                  src={image.src}
                />
              </button>
              <div className="border-subtle flex items-baseline justify-between border-b pb-4">
                <p className="text-primary text-sm font-medium tracking-wide uppercase">
                  {image.title}
                </p>
                <span className="text-muted font-mono text-xs">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {navigation && (navigation.prev || navigation.next) && (
      <section className="border-subtle border-t">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="grid grid-cols-2">
            <div className="group border-subtle hover:bg-secondary/5 border-r py-12 pr-6 md:py-24">
              {navigation.prev ? (
                <a
                  className="block h-full"
                  href={`/case-studies/${navigation.prev.slug}`}
                >
                  <span className="text-muted group-hover:text-primary block pb-4 font-mono text-xs tracking-widest uppercase">
                    Previous Case Study
                  </span>
                  <div className="flex items-center gap-4">
                    <HugeiconsIcon
                      className="text-secondary transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-x-2 motion-reduce:transform-none"
                      color="currentColor"
                      icon={ArrowLeft01Icon}
                      size={20}
                      strokeWidth={1.5}
                    />
                    <h3 className="text-primary text-xl font-medium transition-opacity duration-300 group-hover:opacity-70 md:text-3xl">
                      {navigation.prev.title}
                    </h3>
                  </div>
                </a>
              ) : (
                <div aria-hidden="true" className="opacity-0 select-none">
                  Placeholder
                </div>
              )}
            </div>
            <div className="group border-subtle hover:bg-secondary/5 py-12 pl-6 text-right md:py-24 md:pl-12">
              {navigation.next ? (
                <a
                  className="block h-full"
                  href={`/case-studies/${navigation.next.slug}`}
                >
                  <span className="text-muted group-hover:text-primary block pb-4 font-mono text-xs tracking-widest uppercase">
                    Next Case Study
                  </span>
                  <div className="flex items-center justify-end gap-4">
                    <h3 className="text-primary text-xl font-medium transition-opacity duration-300 group-hover:opacity-70 md:text-3xl">
                      {navigation.next.title}
                    </h3>
                    <HugeiconsIcon
                      className="text-secondary transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-2 motion-reduce:transform-none"
                      color="currentColor"
                      icon={ArrowRight01Icon}
                      size={20}
                      strokeWidth={1.5}
                    />
                  </div>
                </a>
              ) : (
                <div aria-hidden="true" className="opacity-0 select-none">
                  Placeholder
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )}
  </>
);

const CaseStudyLightbox = ({
  selectedImage,
  onClose,
}: {
  selectedImage: string | null;
  onClose: () => void;
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeLightbox = useEffectEvent(onClose);

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const dialogElement = dialogRef.current;
    const siblingInertStates = dialogElement?.parentElement
      ? [...dialogElement.parentElement.children]
          .filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && element !== dialogElement
          )
          .map((element) => [element, element.inert] as const)
      : [];

    document.body.style.overflow = "hidden";
    for (const [element] of siblingInertStates) {
      element.inert = true;
    }
    closeButtonRef.current?.focus();
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (dialogElement) {
        trapDialogFocus(event, dialogElement);
      }
    };
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleDocumentKeyDown);
      for (const [element, wasInert] of siblingInertStates) {
        element.inert = wasInert;
      }
    };
  }, [selectedImage]);

  return selectedImage ? (
    <dialog
      aria-label="Enlarged gallery image"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex size-full max-h-none max-w-none items-center justify-center border-0 bg-black/90 p-4 backdrop-blur-sm"
      open
      ref={dialogRef}
      tabIndex={-1}
    >
      <button
        aria-label="Close image preview"
        className="absolute inset-0 cursor-default border-0 bg-transparent p-0"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <button
        aria-label="Close image preview"
        className="absolute top-4 right-4 z-20 flex size-11 touch-manipulation items-center justify-center text-white/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        <HugeiconsIcon
          color="currentColor"
          icon={Cancel01Icon}
          size={32}
          strokeWidth={1.5}
        />
      </button>
      <m.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 aspect-video w-full max-w-7xl overflow-hidden rounded-lg shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <img
          alt="Enlarged gallery view"
          className="object-contain"
          src={selectedImage}
        />
      </m.div>
    </dialog>
  ) : null;
};

const CaseStudyPage = ({
  caseStudy,
  navigation,
}: {
  caseStudy: CaseStudy;
  navigation?: CaseStudyNavigation;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const galleryTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleSelectImage = (src: string, trigger: HTMLButtonElement) => {
    galleryTriggerRef.current = trigger;
    setSelectedImage(src);
  };
  const handleCloseLightbox = () => {
    setSelectedImage(null);
    requestAnimationFrame(() => galleryTriggerRef.current?.focus());
  };

  return (
    <MotionRoot>
      <div className="bg-primary min-h-screen pt-40 md:pt-48">
        <CaseStudyHeader caseStudy={caseStudy} />
        <CaseStudyContent
          caseStudy={caseStudy}
          navigation={navigation}
          onSelectImage={handleSelectImage}
        />
        <CaseStudyLightbox
          onClose={handleCloseLightbox}
          selectedImage={selectedImage}
        />
      </div>
    </MotionRoot>
  );
};

export default CaseStudyPage;
