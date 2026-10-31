package com.github.umycael.analisadorvideos.service;

import org.springframework.stereotype.Service;

@Service
public class ResumoService {

    private static final String INSTRUCAO = """
            Você é um assistente especialista em resumir vídeos a partir da transcrição do áudio.
            Responda sempre em português do Brasil, com formatação Markdown.
            Estruture o resumo assim:
            ## Tema
            Uma ou duas frases dizendo do que se trata o vídeo.
            ## Pontos principais
            Lista com as ideias mais importantes, em ordem.
            ## Conclusão
            A mensagem final ou o aprendizado central.
            Use apenas informações presentes na transcrição. Não invente nada.
            """;

    private final GeminiService gemini;

    public ResumoService(GeminiService gemini) {
        this.gemini = gemini;
    }

    public String resumir(String transcricao) {
        return gemini.gerar(INSTRUCAO, "Resuma o seguinte vídeo:\n\n" + transcricao);
    }
}