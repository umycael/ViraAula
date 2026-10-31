import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { cleanMarkdownWrapper } from "./cleanWrapper";

/**
 * Converte Markdown para HTML limpo e sem classes, preservando
 * a hierarquia de cabeçalhos original (h1, h2, h3...), listas, negritos, etc.
 *
 * Ideal para área de transferência com formato text/html (Notion, Google Docs).
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const cleaned = cleanMarkdownWrapper(markdown);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(cleaned);

  return String(file);
}

