package com.github.umycael.analisadorvideos.dto;

import java.util.List;

public final class GeminiDto {

    private GeminiDto() {}

    public record Part(String text) {}

    public record Content(List<Part> parts) {}

    public record Request(Content systemInstruction, List<Content> contents) {}

    public record Candidate(Content content) {}

    public record Response(List<Candidate> candidates) {}
}