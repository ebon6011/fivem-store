import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface Doc {
  slug: string;
  title: string;
  html: string;
}

export async function getDoc(slug: string): Promise<Doc | null> {
  if (!SLUG_PATTERN.test(slug)) return null;

  let raw: string;
  try {
    raw = await readFile(path.join(DOCS_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const rendered = await remark().use(html).process(content);
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    html: String(rendered),
  };
}

export async function listDocSlugs(): Promise<string[]> {
  const files = await readdir(DOCS_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}
