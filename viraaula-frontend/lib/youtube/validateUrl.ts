export interface ValidationResult {
  valid: boolean;
  error?: string;
  videoId?: string;
}

const VALID_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

const VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

export function validateYoutubeUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: "Cole o link do vídeo para continuar.",
    };
  }

  let parsed: URL;
  try {
    // Se o usuário não colocar protocolo, tente adicionar https:// se parecer um domínio do youtube
    const urlToParse = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    parsed = new URL(urlToParse);
  } catch {
    return {
      valid: false,
      error:
        "Esse link não parece ser de um vídeo do YouTube. Confira e tente novamente.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!VALID_HOSTS.has(hostname)) {
    return {
      valid: false,
      error:
        "Esse link não parece ser de um vídeo do YouTube. Confira e tente novamente.",
    };
  }

  // Rejeita explicitamente links de canais
  if (
    parsed.pathname.startsWith("/channel/") ||
    parsed.pathname.startsWith("/c/") ||
    parsed.pathname.startsWith("/user/") ||
    parsed.pathname.startsWith("/@")
  ) {
    return {
      valid: false,
      error:
        "Esse link não parece ser de um vídeo do YouTube. Confira e tente novamente.",
    };
  }

  // Rejeita links apenas de playlist (sem parâmetro v)
  if (parsed.pathname === "/playlist" && !parsed.searchParams.get("v")) {
    return {
      valid: false,
      error:
        "Esse link não parece ser de um vídeo do YouTube. Confira e tente novamente.",
    };
  }

  let videoId: string | null = null;

  if (hostname === "youtu.be") {
    // Ex: https://youtu.be/ID ou https://youtu.be/ID?t=12
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      videoId = segments[0];
    }
  } else {
    // youtube.com, www.youtube.com, m.youtube.com, music.youtube.com
    if (parsed.pathname === "/watch") {
      videoId = parsed.searchParams.get("v");
    } else if (
      parsed.pathname.startsWith("/shorts/") ||
      parsed.pathname.startsWith("/live/") ||
      parsed.pathname.startsWith("/embed/")
    ) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2) {
        videoId = segments[1];
      }
    }
  }

  if (videoId && VIDEO_ID_REGEX.test(videoId)) {
    return {
      valid: true,
      videoId,
    };
  }

  return {
    valid: false,
    error:
      "Esse link não parece ser de um vídeo do YouTube. Confira e tente novamente.",
  };
}

