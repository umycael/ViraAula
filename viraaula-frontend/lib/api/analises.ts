import {
  mapBackendError,
  STANDARD_ERROR_MESSAGES,
} from "./errors";

export interface AnaliseResponse {
  resumo: string;
  aula: string;
}

export class AnaliseError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isTimeout?: boolean
  ) {
    super(message);
    this.name = "AnaliseError";
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";

const DEFAULT_TIMEOUT_MS = 180_000; // 180 segundos

export async function analisarVideo(
  url: string,
  externalSignal?: AbortSignal
): Promise<AnaliseResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort("TIMEOUT");
  }, DEFAULT_TIMEOUT_MS);

  // Combina com o externalSignal se fornecido
  const onExternalAbort = () => {
    controller.abort("EXTERNAL_ABORT");
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      throw new AnaliseError("Operação cancelada.");
    }
    externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url.trim() }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }

    if (!response.ok) {
      let rawMessage = "";
      try {
        const errorJson = await response.json();
        rawMessage = errorJson?.mensagem || "";
      } catch {
        rawMessage = await response.text().catch(() => "");
      }

      const friendlyMessage = mapBackendError(rawMessage, response.status);
      throw new AnaliseError(friendlyMessage, response.status);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new AnaliseError(STANDARD_ERROR_MESSAGES.INCOMPLETE_RESPONSE);
    }

    const payload = data as { resumo?: unknown; aula?: unknown };
    if (
      typeof payload?.resumo !== "string" ||
      typeof payload?.aula !== "string" ||
      payload.resumo.trim() === "" ||
      payload.aula.trim() === ""
    ) {
      throw new AnaliseError(STANDARD_ERROR_MESSAGES.INCOMPLETE_RESPONSE);
    }

    return {
      resumo: payload.resumo,
      aula: payload.aula,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener("abort", onExternalAbort);
    }

    if (err instanceof AnaliseError) {
      throw err;
    }

    // Se o controller abortou por TIMEOUT
    if (controller.signal.aborted && controller.signal.reason === "TIMEOUT") {
      throw new AnaliseError(STANDARD_ERROR_MESSAGES.TIMEOUT, undefined, true);
    }

    // Se foi abort externo (desmontagem do componente)
    if (
      externalSignal?.aborted ||
      (controller.signal.aborted && controller.signal.reason === "EXTERNAL_ABORT")
    ) {
      throw new AnaliseError("Operação cancelada.");
    }

    // Erros de conexão, CORS ou rede (ex: TypeError do fetch)
    if (err instanceof TypeError) {
      throw new AnaliseError(STANDARD_ERROR_MESSAGES.NETWORK_ERROR);
    }

    const message =
      err instanceof Error ? err.message : String(err);
    if (message.includes("abort") || message.includes("Abort")) {
      throw new AnaliseError(STANDARD_ERROR_MESSAGES.TIMEOUT, undefined, true);
    }

    throw new AnaliseError(STANDARD_ERROR_MESSAGES.NETWORK_ERROR);
  }
}

