import type { JSX } from "react";

const headingClass = "text-primary scroll-mt-28 font-bold tracking-tight";

export const blogMdxComponents = {
  a: ({
    children,
    href,
    ...props
  }: JSX.IntrinsicElements["a"]): JSX.Element => {
    const isInternal = href?.startsWith("/") ?? false;
    if (isInternal) {
      return (
        <a
          className="text-primary decoration-subtle hover:decoration-primary underline underline-offset-4 transition-colors duration-150"
          href={href}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <a
        className="text-primary decoration-subtle hover:decoration-primary underline underline-offset-4 transition-colors duration-150"
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: ({
    children,
  }: JSX.IntrinsicElements["blockquote"]): JSX.Element => (
    <blockquote className="border-primary text-primary border-l-2 py-2 pl-6 text-xl italic">
      {children}
    </blockquote>
  ),
  code: ({ children }: JSX.IntrinsicElements["code"]): JSX.Element => (
    <code className="bg-secondary/10 text-primary rounded px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  h1: ({ children, ...props }: JSX.IntrinsicElements["h1"]): JSX.Element => (
    <h2 className={`${headingClass} pt-6 text-2xl md:text-3xl`} {...props}>
      {children}
    </h2>
  ),
  h2: ({ children, ...props }: JSX.IntrinsicElements["h2"]): JSX.Element => (
    <h2 className={`${headingClass} pt-6 text-2xl md:text-3xl`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: JSX.IntrinsicElements["h3"]): JSX.Element => (
    <h3 className={`${headingClass} pt-2 text-xl md:text-2xl`} {...props}>
      {children}
    </h3>
  ),
  img: ({ alt, src }: JSX.IntrinsicElements["img"]): JSX.Element => (
    <figure className="flex flex-col gap-4 py-6 md:py-10">
      <div className="bg-secondary/5 relative w-full overflow-hidden rounded-sm">
        <img
          alt={alt ?? ""}
          className="h-auto w-full object-contain"
          height={500}
          loading="lazy"
          src={src}
          width={800}
        />
      </div>
    </figure>
  ),
  ol: ({ children }: JSX.IntrinsicElements["ol"]): JSX.Element => (
    <ol className="text-secondary flex list-outside list-decimal flex-col gap-2 pl-4 text-lg">
      {children}
    </ol>
  ),
  p: ({ children }: JSX.IntrinsicElements["p"]): JSX.Element => (
    <p className="text-secondary text-lg leading-relaxed">{children}</p>
  ),
  pre: ({ children }: JSX.IntrinsicElements["pre"]): JSX.Element => (
    <pre className="border-subtle bg-secondary/10 overflow-x-auto rounded-sm border p-4">
      {children}
    </pre>
  ),
  strong: ({ children }: JSX.IntrinsicElements["strong"]): JSX.Element => (
    <strong className="text-primary font-semibold">{children}</strong>
  ),
  ul: ({ children }: JSX.IntrinsicElements["ul"]): JSX.Element => (
    <ul className="text-secondary flex list-outside list-disc flex-col gap-2 pl-4 text-lg">
      {children}
    </ul>
  ),
};
