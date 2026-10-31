package com.github.umycael.analisadorvideos.service;

import com.github.umycael.analisadorvideos.config.GeminiProperties;
import com.github.umycael.analisadorvideos.dto.GeminiDto.*;
import com.github.umycael.analisadorvideos.exception.VideoException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Service
public class GeminiService {

    private final GeminiProperties props;
    private final RestClient restClient;

    public GeminiService(GeminiProperties props) {
        this.props = props;
        this.restClient = RestClient.builder()
                .baseUrl(props.baseUrl())
                .defaultHeader("x-goog-api-key", props.apiKey())
                .build();
    }

    public String gerar(String instrucaoSistema, String texto) {
        Request corpo = new Request(
                new Content(List.of(new Part(instrucaoSistema))),
                List.of(new Content(List.of(new Part(texto))))
        );

        try {
            Response resposta = restClient.post()
                    .uri("/models/{modelo}:generateContent", props.model())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(corpo)
                    .retrieve()
                    .body(Response.class);

            if (resposta == null || resposta.candidates() == null || resposta.candidates().isEmpty()) {
                throw new VideoException("O Gemini não devolveu nenhuma resposta.");
            }
            return resposta.candidates().get(0).content().parts().get(0).text();

        } catch (RestClientResponseException e) {
            throw new VideoException("Erro do Gemini (" + e.getStatusCode() + "): "
                    + e.getResponseBodyAsString(), e);
        }
    }
}