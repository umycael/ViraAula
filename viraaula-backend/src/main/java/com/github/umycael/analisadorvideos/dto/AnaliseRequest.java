package com.github.umycael.analisadorvideos.dto;

import jakarta.validation.constraints.NotBlank;

public record AnaliseRequest(
        @NotBlank(message = "A URL do vídeo é obrigatória.") String url
) {}