/**
 * One-time Sanity → Graft export.
 *
 * Reads published posts from the Sanity HTTP API, writes MDX under
 * content/posts/, and downloads images into public/blog/<slug>/.
 *
 * Usage (from apps/web, with project id + dataset in the environment):
 *   bun run export:sanity
 *
 * Env (any of the historical names):
 *   PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_STUDIO_PROJECT_ID
 *   PUBLIC_SANITY_DATASET / NEXT_PUBLIC_SANITY_DATASET / SANITY_STUDIO_DATASET
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTENT_DIR = path.join(PROJECT_ROOT, "content", "posts");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public", "blog");
const API_VERSION = "2024-01-01";

const GROQ = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  seoTitle,
  seoDescription,
  categories[]->{ title },
  mainImage{ alt, caption, asset->{ url, originalFilename, extension } },
  body[]{
    ...,
    _type == "image" => { ..., asset->{ url, originalFilename, extension } }
  }
}`;

type SanityAsset = {
  extension?: string;
  originalFilename?: string;
  url?: string;
};

type SanityImage = {
  alt?: string;
  asset?: SanityAsset;
  caption?: string;
};

type SanitySpan = {
  _type?: string;
  marks?: string[];
  text?: string;
};

type SanityMarkDef = {
  _key?: string;
  _type?: string;
  href?: string;
};

type SanityBlock = {
  _type?: string;
  alt?: string;
  asset?: SanityAsset;
  caption?: string;
  children?: SanitySpan[];
  code?: string;
  language?: string;
  level?: number;
  listItem?: "bullet" | "number";
  markDefs?: SanityMarkDef[];
  style?: string;
};

type SanityPost = {
  body?: SanityBlock[];
  categories?: Array<{ title?: string } | null>;
  excerpt?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  title?: string;
};

const readEnv = (keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
};

const projectId = readEnv([
  "PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "SANITY_STUDIO_PROJECT_ID",
]);
const dataset = readEnv([
  "PUBLIC_SANITY_DATASET",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_STUDIO_DATASET",
]);

const yamlQuote = (value: string): string => {
  if (value === "") {
    return '""';
  }
  if (/[:#[\]{}&*!|>'"%@`\n]/.test(value) || value.startsWith("-") || value.startsWith("?")) {
    return JSON.stringify(value);
  }
  return value;
};

const extensionFromAsset = (asset: SanityAsset | undefined, fallback: string): string => {
  if (asset?.extension) {
    return `.${asset.extension.replace(/^\./, "")}`;
  }
  if (asset?.originalFilename) {
    return path.extname(asset.originalFilename) || fallback;
  }
  if (asset?.url) {
    const pathname = new URL(asset.url).pathname;
    return path.extname(pathname) || fallback;
  }
  return fallback;
};

const downloadAsset = async (
  url: string,
  destDir: string,
  filename: string
): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  await mkdir(destDir, { recursive: true });
  await writeFile(path.join(destDir, filename), bytes);
  return filename;
};

const escapeMarkdown = (text: string): string =>
  text.replace(/([\\`*_[\]#])/g, "\\$1");

const renderSpans = (children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string => {
  if (!children) {
    return "";
  }
  const defs = new Map((markDefs ?? []).map((def) => [def._key ?? "", def]));
  return children
    .map((span) => {
      let text = escapeMarkdown(span.text ?? "");
      const marks = span.marks ?? [];
      for (const mark of marks) {
        if (mark === "strong") {
          text = `**${text}**`;
          continue;
        }
        if (mark === "em") {
          text = `*${text}*`;
          continue;
        }
        if (mark === "code") {
          text = `\`${span.text ?? ""}\``;
          continue;
        }
        const def = defs.get(mark);
        if (def?._type === "link" && def.href) {
          text = `[${span.text ?? ""}](${def.href})`;
        }
      }
      return text;
    })
    .join("");
};

const headingPrefix = (style: string | undefined): string | null => {
  if (style === "h1") return "# ";
  if (style === "h2") return "## ";
  if (style === "h3") return "### ";
  if (style === "h4") return "#### ";
  return null;
};

type ImageWriter = (block: SanityBlock, index: number) => Promise<string>;

const portableTextToMarkdown = async (
  body: SanityBlock[] | undefined,
  writeImage: ImageWriter
): Promise<string> => {
  if (!body || body.length === 0) {
    return "";
  }

  const lines: string[] = [];
  let listBuffer: string[] = [];
  let listKind: "bullet" | "number" | null = null;
  let imageIndex = 0;

  const flushList = () => {
    if (listBuffer.length > 0) {
      lines.push(listBuffer.join("\n"), "");
      listBuffer = [];
    }
    listKind = null;
  };

  for (const block of body) {
    if (block._type === "code") {
      flushList();
      const language = block.language ?? "";
      lines.push(`\`\`\`${language}`, block.code ?? "", "```", "");
      continue;
    }

    if (block._type === "image") {
      flushList();
      const src = await writeImage(block, imageIndex);
      imageIndex += 1;
      const alt = block.alt || block.caption || "";
      lines.push(`![${alt}](${src})`, "");
      if (block.caption) {
        lines.push(`*${block.caption}*`, "");
      }
      continue;
    }

    if (block._type !== "block") {
      continue;
    }

    if (block.listItem === "bullet" || block.listItem === "number") {
      if (listKind !== block.listItem) {
        flushList();
        listKind = block.listItem;
      }
      const marker = block.listItem === "number" ? "1." : "-";
      listBuffer.push(`${marker} ${renderSpans(block.children, block.markDefs)}`);
      continue;
    }

    flushList();
    const text = renderSpans(block.children, block.markDefs);
    const heading = headingPrefix(block.style);
    if (heading) {
      lines.push(`${heading}${text}`, "");
      continue;
    }
    if (block.style === "blockquote") {
      lines.push(`> ${text}`, "");
      continue;
    }
    if (text.length > 0) {
      lines.push(text, "");
    }
  }

  flushList();
  return lines.join("\n").trim() + "\n";
};

const toFrontmatter = (post: SanityPost, mainImage: { alt: string; caption?: string; src: string } | undefined): string => {
  const rows = [
    `title: ${yamlQuote(post.title ?? "Untitled")}`,
    `excerpt: ${yamlQuote(post.excerpt ?? "")}`,
    `publishedAt: ${JSON.stringify(new Date(post.publishedAt ?? Date.now()).toISOString())}`,
  ];
  const categories = (post.categories ?? [])
    .map((category) => category?.title)
    .filter((title): title is string => Boolean(title));
  if (categories.length > 0) {
    rows.push("categories:");
    for (const category of categories) {
      rows.push(`  - ${yamlQuote(category)}`);
    }
  }
  if (mainImage) {
    rows.push("mainImage:");
    rows.push(`  src: ${yamlQuote(mainImage.src)}`);
    rows.push(`  alt: ${yamlQuote(mainImage.alt)}`);
    if (mainImage.caption) {
      rows.push(`  caption: ${yamlQuote(mainImage.caption)}`);
    }
  }
  if (post.seoTitle) {
    rows.push(`seoTitle: ${yamlQuote(post.seoTitle)}`);
  }
  if (post.seoDescription) {
    rows.push(`seoDescription: ${yamlQuote(post.seoDescription)}`);
  }
  return `---\n${rows.join("\n")}\n---\n`;
};

const exportPosts = async (): Promise<void> => {
  if (!projectId || !dataset) {
    console.error(
      "Missing Sanity project id or dataset. Set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET (or the NEXT_PUBLIC_/SANITY_STUDIO_ aliases) and retry."
    );
    process.exitCode = 1;
    return;
  }

  const queryUrl = new URL(
    `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}`
  );
  queryUrl.searchParams.set("query", GROQ);

  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`Sanity query failed: HTTP ${response.status} ${await response.text()}`);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("result" in payload) ||
    !Array.isArray(payload.result)
  ) {
    throw new Error("Sanity query returned an unexpected payload.");
  }

  const posts = payload.result as SanityPost[];
  await mkdir(CONTENT_DIR, { recursive: true });

  for (const post of posts) {
    const slug = post.slug;
    if (!slug) {
      continue;
    }

    const assetDir = path.join(PUBLIC_DIR, slug);
    let mainImage: { alt: string; caption?: string; src: string } | undefined;
    if (post.mainImage?.asset?.url) {
      const filename = `hero${extensionFromAsset(post.mainImage.asset, ".jpg")}`;
      await downloadAsset(post.mainImage.asset.url, assetDir, filename);
      mainImage = {
        alt: post.mainImage.alt || post.title || slug,
        caption: post.mainImage.caption,
        src: `/blog/${slug}/${filename}`,
      };
    }

    const markdown = await portableTextToMarkdown(post.body, async (block, index) => {
      if (!block.asset?.url) {
        return "";
      }
      const filename = `figure-${index + 1}${extensionFromAsset(block.asset, ".jpg")}`;
      await downloadAsset(block.asset.url, assetDir, filename);
      return `/blog/${slug}/${filename}`;
    });

    const mdx = `${toFrontmatter(post, mainImage)}\n${markdown}`;
    await writeFile(path.join(CONTENT_DIR, `${slug}.mdx`), mdx, "utf8");
    console.log(`Wrote content/posts/${slug}.mdx`);
  }

  console.log(`Exported ${posts.length} post(s). Run \`bun run graft:compile\` next.`);
};

await exportPosts();
