"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { copyMarkdownToClipboard } from "@/lib/clipboard";

interface CopyButtonProps {
  label: string;
  content: string;
  onErrorMessage?: (message: string | null) => void;
}

export default function CopyButton({
  label,
  content,
  onErrorMessage,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (copying) return;
    setCopying(true);
    onErrorMessage?.(null);

    try {
      const result = await copyMarkdownToClipboard(content);
      if (result.success) {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      } else {
        onErrorMessage?.(
          result.error ||
            "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente."
        );
      }
    } catch {
      onErrorMessage?.(
        "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente."
      );
    } finally {
      setCopying(false);
    }
  }, [content, copying, onErrorMessage]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={copying}
      aria-label={copied ? "Copiado com sucesso!" : label}
      className="copy-button"
      style={copied ? { background: "#111111", borderColor: "#111111", color: "#ffffff" } : undefined}
    >
      <span aria-live="polite" className="inline-flex items-center gap-1.5">
        {copied ? (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Copiado!</span>
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </span>
    </button>
  );
}
