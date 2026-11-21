import type { JSX } from "react";

/**
 * Overrides for blog MDX. Styling lives in `.prose` (styles/site.css); these
 * only change behaviour: links leaving the site open in a new tab, pictures
 * load lazily, and code blocks get the class that picks the Shiki theme.
 */
export const blogMdxComponents = {
  a: ({ children, href, ...props }: JSX.IntrinsicElements["a"]): JSX.Element =>
    href?.startsWith("/") || href?.startsWith("#") ? (
      <a href={href} {...props}>
        {children}
      </a>
    ) : (
      <a href={href} rel="noreferrer noopener" target="_blank" {...props}>
        {children}
      </a>
    ),
  img: ({ alt, src }: JSX.IntrinsicElements["img"]): JSX.Element => (
    <figure>
      <img
        alt={alt ?? ""}
        decoding="async"
        height={500}
        loading="lazy"
        src={src}
        width={800}
      />
    </figure>
  ),
  pre: ({ children, ...props }: JSX.IntrinsicElements["pre"]): JSX.Element => (
    <pre {...props} className="blog-code">
      {children}
    </pre>
  ),
};
