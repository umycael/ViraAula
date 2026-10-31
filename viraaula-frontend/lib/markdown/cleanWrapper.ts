/**
 * Pré-processamento estritamente permitido pelo prompt:
 * (a) trim();
 * (b) se o conteúdo inteiro estiver embrulhado em um único bloco de código cercado
 *     (```markdown ou ```md), remove apenas esse invólucro exterior.
 *
 * É terminantemente proibido apagar '#', '*', '\n' etc., para não danificar
 * conteúdos legítimos como 'C#', '#hashtag' ou '3 * 4 = 12'.
 */
export function cleanMarkdownWrapper(content: string): string {
  const trimmed = content.trim();
  const match = /^```(?:markdown|md)?\r?\n([\s\S]*?)\r?\n```$/i.exec(trimmed);
  if (match) {
    return match[1].trim();
  }
  return trimmed;
}

