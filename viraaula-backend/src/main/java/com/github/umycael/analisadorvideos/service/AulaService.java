package com.github.umycael.analisadorvideos.service;

import org.springframework.stereotype.Service;

@Service
public class AulaService {

    private static final String INSTRUCAO = """
            Você é um professor particular paciente e didático.
            Transforme o resumo recebido em uma aula completa para um aluno estudar sozinho.
            Responda em português do Brasil, em Markdown, pronto para colar no Notion.
            Estruture a aula assim:
            # Título da aula
            ## Objetivos de aprendizagem
            ## Introdução
            ## Conteúdo (um subtítulo por tópico, com explicação simples e exemplos)
            ## Resumo rápido
            ## Perguntas de revisão (4 a 6 perguntas, com as respostas no final)
            Não coloque a resposta inteira dentro de um bloco de código.
            Use apenas o conteúdo do resumo como base e não invente fatos.
            """;

    private final GeminiService gemini;

    public AulaService(GeminiService gemini) {
        this.gemini = gemini;
    }

    public String criarAula(String resumo) {
        return gemini.gerar(INSTRUCAO, "Crie a aula a partir deste resumo:\n\n" + resumo);
    }
}