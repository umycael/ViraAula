/**
 * Mapeamento de mensagens reais do back-end (início da string) para mensagens
 * amigáveis ao usuário.
 */
export const BACKEND_ERROR_MAPPING: Record<string, string> = {
  "Não foi possível baixar o áudio":
    "Não conseguimos baixar o áudio deste vídeo. Confira se o link está correto e se o vídeo é público.",
  "O áudio passa de 25 MB":
    "Este vídeo é muito longo para esta versão. Tente um vídeo mais curto.",
  "A transcrição voltou vazia":
    "Não identificamos fala neste vídeo. Tente um vídeo em que o conteúdo esteja no áudio.",
  "Erro do Groq (":
    "O serviço de inteligência artificial está indisponível ou sobrecarregado no momento. Tente novamente em instantes.",
  "Erro do Gemini (":
    "O serviço de inteligência artificial está indisponível ou sobrecarregado no momento. Tente novamente em instantes.",
  "O Gemini não devolveu":
    "O serviço de inteligência artificial está indisponível ou sobrecarregado no momento. Tente novamente em instantes.",
  "Erro inesperado ao processar o vídeo":
    "Algo deu errado ao processar o vídeo. Tente novamente.",
  "Erro ao executar o yt-dlp":
    "Algo deu errado ao processar o vídeo. Tente novamente.",
  "A URL do vídeo é obrigatória.":
    "Cole o link do vídeo para continuar.",
};

export const STANDARD_ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Não conseguimos nos conectar ao servidor. Verifique sua conexão e tente novamente.",
  TIMEOUT:
    "A análise está demorando mais que o esperado. Tente novamente ou use um vídeo mais curto.",
  GENERIC_500:
    "Algo deu errado ao processar o vídeo. Tente novamente.",
  UNRECOGNIZED_400:
    "Não foi possível processar este vídeo. Tente novamente.",
  INCOMPLETE_RESPONSE:
    "Recebemos uma resposta incompleta do servidor. Tente novamente.",
  COPY_FAILED:
    "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.",
};

/**
 * Traduz erros brutos do backend ou exceções em mensagens amigáveis ao usuário.
 */
export function mapBackendError(rawMessage: string, statusCode?: number): string {
  if (process.env.NODE_ENV !== "production") {
    console.error("[ViraAula API Error]:", { statusCode, rawMessage });
  }

  for (const [prefix, userMessage] of Object.entries(BACKEND_ERROR_MAPPING)) {
    if (rawMessage.startsWith(prefix)) {
      return userMessage;
    }
  }

  if (statusCode && statusCode >= 500) {
    return STANDARD_ERROR_MESSAGES.GENERIC_500;
  }

  return STANDARD_ERROR_MESSAGES.UNRECOGNIZED_400;
}
