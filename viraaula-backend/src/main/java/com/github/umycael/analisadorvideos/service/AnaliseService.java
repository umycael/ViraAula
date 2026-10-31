package com.github.umycael.analisadorvideos.service;

import com.github.umycael.analisadorvideos.dto.AnaliseResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class AnaliseService {

    private final VideoDownloadService downloadService;
    private final TranscricaoService transcricaoService;
    private final ResumoService resumoService;
    private final AulaService aulaService;

    public AnaliseService(VideoDownloadService downloadService,
                          TranscricaoService transcricaoService,
                          ResumoService resumoService,
                          AulaService aulaService) {
        this.downloadService = downloadService;
        this.transcricaoService = transcricaoService;
        this.resumoService = resumoService;
        this.aulaService = aulaService;
    }

    public AnaliseResponse analisar(String url) {
        Path audio = downloadService.baixarAudio(url);
        try {
            String transcricao = transcricaoService.transcrever(audio);
            String resumo = resumoService.resumir(transcricao);
            String aula = aulaService.criarAula(resumo);
            return new AnaliseResponse(resumo, aula);
        } finally {
            apagar(audio);
        }
    }

    private void apagar(Path audio) {
        try {
            Files.deleteIfExists(audio);
            Files.deleteIfExists(audio.getParent());
        } catch (IOException ignored) {
            // limpeza é "melhor esforço": se falhar, não derruba a requisição
        }
    }
}