import { markdownToHtml } from "./markdown/toHtml";
import { markdownToPlainText } from "./markdown/toPlainText";

export interface CopyResult {
  success: boolean;
  error?: string;
}

export async function copyMarkdownToClipboard(
  rawMarkdown: string
): Promise<CopyResult> {
  const plainText = markdownToPlainText(rawMarkdown);

  // Tentativa 1: ClipboardItem estruturado (text/html + text/plain)
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.write === "function" &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const htmlText = await markdownToHtml(rawMarkdown);

      const htmlBlob = new Blob([htmlText], { type: "text/html" });
      const textBlob = new Blob([plainText], { type: "text/plain" });

      const item = new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      });

      await navigator.clipboard.write([item]);
      return { success: true };
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Clipboard] Erro na tentativa 1 (ClipboardItem):", err);
      }
    }
  }

  // Tentativa 2: navigator.clipboard.writeText
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(plainText);
      return { success: true };
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Clipboard] Erro na tentativa 2 (writeText):", err);
      }
    }
  }

  // Tentativa 3: Textarea temporário com execCommand
  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (successful) {
        return { success: true };
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Clipboard] Erro na tentativa 3 (execCommand):", err);
      }
    }
  }

  return {
    success: false,
    error:
      "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.",
  };
}
