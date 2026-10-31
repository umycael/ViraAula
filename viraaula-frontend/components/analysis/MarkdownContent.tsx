"use client";

import React, { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cleanMarkdownWrapper } from "@/lib/markdown/cleanWrapper";

interface MarkdownContentProps {
  content: string;
}

function isSafeUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  );
}

/**
 * Composição tipográfica dos materiais de estudo.
 * Corpo em 1.02rem/1.75 dentro de medida estreita (≤ 80 caracteres).
 * Hierarquia por peso e escala — sem caixa-alta, sem rótulos, sem acento
 * vermelho em palavras isoladas.
 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  const cleaned = useMemo(() => cleanMarkdownWrapper(content), [content]);

  const components: Components = useMemo(
    () => ({
      h1: ({ children }) => (
        <h3 className="text-[1.35rem] font-semibold tracking-tight text-ink mt-10 mb-4 font-sans leading-snug [overflow-wrap:anywhere]">
          {children}
        </h3>
      ),
      h2: ({ children }) => (
        <h4 className="text-[1.16rem] font-semibold tracking-tight text-ink mt-8 mb-3 font-sans leading-snug [overflow-wrap:anywhere]">
          {children}
        </h4>
      ),
      h3: ({ children }) => (
        <h5 className="text-[1.06rem] font-semibold text-ink mt-7 mb-2.5 font-sans leading-snug [overflow-wrap:anywhere]">
          {children}
        </h5>
      ),
      h4: ({ children }) => (
        <h6 className="text-[1rem] font-semibold text-ink mt-6 mb-2 font-sans leading-snug [overflow-wrap:anywhere]">
          {children}
        </h6>
      ),
      h5: ({ children }) => (
        <h6 className="text-[1rem] font-medium text-ink mt-5 mb-2 font-sans [overflow-wrap:anywhere]">
          {children}
        </h6>
      ),
      h6: ({ children }) => (
        <h6 className="text-[0.95rem] font-medium text-ink mt-5 mb-1.5 font-sans [overflow-wrap:anywhere]">
          {children}
        </h6>
      ),

      p: ({ children }) => (
        <p className="text-text text-[1.02rem] leading-[1.75] my-5 [overflow-wrap:anywhere]">
          {children}
        </p>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-ink">{children}</strong>
      ),

      em: ({ children }) => <em className="italic text-text">{children}</em>,

      del: ({ children }) => (
        <del className="line-through text-muted">{children}</del>
      ),

      ul: ({ children }) => (
        <ul className="list-disc list-outside pl-6 my-5 space-y-2.5 text-text text-[1.02rem] leading-[1.75] marker:text-brand-deep">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="list-decimal list-outside pl-6 my-5 space-y-2.5 text-text text-[1.02rem] leading-[1.75] marker:text-brand-deep">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="pl-1 leading-[1.75] [overflow-wrap:anywhere]">
          {children}
        </li>
      ),

      blockquote: ({ children }) => (
        <blockquote className="border-l-[3px] border-brand-deep pl-5 pr-4 py-4 my-6 text-text bg-brand-soft rounded-r-xl [overflow-wrap:anywhere]">
          {children}
        </blockquote>
      ),

      hr: () => <hr className="my-9 border-0 border-t border-rule" />,

      a: ({ href, children }) => {
        if (!isSafeUrl(href)) {
          return <span>{children}</span>;
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-deep underline underline-offset-2 hover:text-ink transition-colors font-medium [overflow-wrap:anywhere]"
          >
            {children}
          </a>
        );
      },

      pre: ({ children }) => (
        <pre className="overflow-x-auto bg-canvas p-4 rounded-lg my-6 text-[0.85rem] font-mono border border-rule text-text leading-relaxed">
          {children}
        </pre>
      ),

      code: ({ className, children }) => {
        const isBlock = Boolean(className);
        if (isBlock) {
          return <code className={className}>{children}</code>;
        }
        return (
          <code className="bg-canvas text-text px-1.5 py-0.5 rounded-md text-[0.88em] font-mono [overflow-wrap:anywhere]">
            {children}
          </code>
        );
      },

      table: ({ children }) => (
        <div className="my-6 w-full overflow-x-auto rounded-lg border border-rule">
          <table className="w-full text-left border-collapse text-[0.92rem]">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }) => (
        <thead className="bg-canvas border-b border-rule">
          {children}
        </thead>
      ),

      tbody: ({ children }) => (
        <tbody className="divide-y divide-rule bg-surface">
          {children}
        </tbody>
      ),

      th: ({ children }) => (
        <th className="p-3 font-semibold text-ink text-left">{children}</th>
      ),

      td: ({ children }) => (
        <td className="p-3 text-text align-top leading-relaxed">{children}</td>
      ),
    }),
    []
  );

  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
