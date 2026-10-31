package com.github.umycael.analisadorvideos.service;

import com.github.umycael.analisadorvideos.config.GroqProperties;
import com.github.umycael.analisadorvideos.dto.TranscricaoResposta;
import com.github.umycael.analisadorvideos.exception.VideoException;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class TranscricaoService {

    private static final long LIMITE_BYTES = 25L * 1024 * 1024;

    private final GroqProperties props;
    private final RestClient restClient;

    public TranscricaoService(GroqProperties props) {
        this.props = props;
        this.restClient = RestClient.builder()
                .baseUrl(props.baseUrl())
                .defaultHeader("Authorization", "Bearer " + props.apiKey())
                .build();
    }

    public String transcrever(Path audio) {
        try {
            if (Files.size(audio) > LIMITE_BYTES) {
                throw new VideoException("O áudio passa de 25 MB. O vídeo é muito longo para esta versão.");
            }
        } catch (IOException e) {
            throw new VideoException("Não foi possível ler o arquivo de áudio.", e);
        }

        MultiValueMap<String, Object> corpo = new LinkedMultiValueMap<>();
        corpo.add("file", new FileSystemResource(audio));
        corpo.add("model", props.transcriptionModel());
        corpo.add("response_format", "json");

        try {
            TranscricaoResposta resposta = restClient.post()
                    .uri("/audio/transcriptions")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(corpo)
                    .retrieve()
                    .body(TranscricaoResposta.class);

            if (resposta == null || resposta.text() == null || resposta.text().isBlank()) {
                throw new VideoException("A transcrição voltou vazia.");
            }
            return resposta.text();

        } catch (RestClientResponseException e) {
            throw new VideoException("Erro do Groq (" + e.getStatusCode() + "): "
                    + e.getResponseBodyAsString(), e);
        }
    }
}