import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { cleanMarkdownWrapper } from "./cleanWrapper";

interface MdastNode {
  type: string;
  value?: string;
  url?: string;
  alt?: string;
  depth?: number;
  ordered?: boolean;
  start?: number;
  children?: MdastNode[];
}

function serializeInlines(nodes?: MdastNode[]): string {
  if (!nodes || !Array.isArray(nodes)) return "";

  let out = "";
  for (const node of nodes) {
    switch (node.type) {
      case "text":
        out += node.value ?? "";
        break;

      case "strong":
      case "emphasis":
      case "delete":
        // Negrito, itálico e tachado: apenas o texto puro, sem marcadores
        out += serializeInlines(node.children);
        break;

      case "inlineCode":
        // Código inline: conteúdo literal sem crases
        out += node.value ?? "";
        break;

      case "link": {
        const linkText = serializeInlines(node.children).trim();
        const url = node.url || "";
        if (linkText && url) {
          out += `${linkText} (${url})`;
        } else {
          out += linkText || url;
        }
        break;
      }

      case "image":
        // Imagens: texto alternativo
        out += node.alt ?? "";
        break;

      case "break":
        out += "\n";
        break;

      case "html":
        // Tags HTML soltas não são impressas
        break;

      default:
        if (node.children) {
          out += serializeInlines(node.children);
        } else if (node.value) {
          out += node.value;
        }
    }
  }

  return out;
}

function serializeBlock(node: MdastNode, indentSpaces = 0): string {
  const indent = " ".repeat(indentSpaces);

  switch (node.type) {
    case "heading": {
      const text = serializeInlines(node.children).trim();
      const isMajor = (node.depth ?? 1) <= 2;
      const formatted = isMajor ? text.toLocaleUpperCase("pt-BR") : text;
      // Linha em branco antes e depois
      return `\n\n${formatted}\n\n`;
    }

    case "paragraph": {
      const text = serializeInlines(node.children).trim();
      return `\n\n${text}\n\n`;
    }

    case "code": {
      // Conteúdo literal do bloco de código
      const codeVal = (node.value ?? "").trim();
      return `\n\n${codeVal}\n\n`;
    }

    case "blockquote": {
      // Citações: o texto com recuo "> "
      const inner = (node.children ?? [])
        .map((child) => serializeBlock(child, indentSpaces))
        .join("")
        .trim();
      const quoted = inner
        .split("\n")
        .map((line) => (line.trim() ? `> ${line}` : ""))
        .join("\n");
      return `\n\n${quoted}\n\n`;
    }

    case "list": {
      const isOrdered = Boolean(node.ordered);
      const startNum = typeof node.start === "number" ? node.start : 1;
      const items = node.children ?? [];

      const listLines: string[] = [];
      items.forEach((item, index) => {
        const prefix = isOrdered ? `${startNum + index}. ` : "- ";
        const itemContent: string[] = [];

        for (const child of item.children ?? []) {
          if (child.type === "list") {
            // Sublista recuada em 2 espaços
            itemContent.push(serializeBlock(child, indentSpaces + 2).trim());
          } else if (child.type === "paragraph") {
            itemContent.push(serializeInlines(child.children).trim());
          } else {
            itemContent.push(serializeBlock(child, indentSpaces).trim());
          }
        }

        const firstBlock = itemContent[0] ?? "";
        const restBlocks = itemContent.slice(1);

        listLines.push(`${indent}${prefix}${firstBlock}`);
        for (const rb of restBlocks) {
          if (rb) {
            listLines.push(rb);
          }
        }
      });

      return `\n\n${listLines.join("\n")}\n\n`;
    }

    case "table": {
      const rows = node.children ?? [];
      const lines: string[] = [];

      for (const row of rows) {
        const cells = row.children ?? [];
        const cellTexts = cells.map((cell) =>
          serializeInlines(cell.children).trim()
        );
        lines.push(cellTexts.join(" | "));
      }

      return `\n\n${lines.join("\n")}\n\n`;
    }

    case "thematicBreak":
      return "\n\n---\n\n";

    default:
      if (node.children) {
        return node.children
          .map((c) => serializeBlock(c, indentSpaces))
          .join("");
      }
      return node.value ?? "";
  }
}

/**
 * Converte Markdown para texto plano formatado para Bloco de Notas / TextEdit:
 * - Percorre a árvore mdast (remark-parse + remark-gfm), sem regex sobre o texto
 * - h1 e h2 em MAIÚSCULAS
 * - Listas com marcadores adequados (- ou 1.)
 * - Parágrafos separados por uma linha em branco
 * - No máximo uma linha em branco seguida e trim() no final
 */
export function markdownToPlainText(markdown: string): string {
  const cleaned = cleanMarkdownWrapper(markdown);
  const processor = unified().use(remarkParse).use(remarkGfm);
  const tree = processor.parse(cleaned) as unknown as MdastNode;

  let rawOutput = "";
  if (tree.children) {
    for (const child of tree.children) {
      rawOutput += serializeBlock(child);
    }
  } else {
    rawOutput = serializeBlock(tree);
  }

  // Normaliza quebras de linha: no máximo uma linha em branco seguida (2 \n)
  const normalized = rawOutput
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return normalized;
}

