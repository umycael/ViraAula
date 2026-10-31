package com.github.umycael.analisadorvideos.controller;

import com.github.umycael.analisadorvideos.dto.AnaliseRequest;
import com.github.umycael.analisadorvideos.dto.AnaliseResponse;
import com.github.umycael.analisadorvideos.service.AnaliseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analises")
public class AnaliseController {

    private final AnaliseService analiseService;

    public AnaliseController(AnaliseService analiseService) {
        this.analiseService = analiseService;
    }

    @PostMapping
    public AnaliseResponse analisar(@Valid @RequestBody AnaliseRequest request) {
        return analiseService.analisar(request.url());
    }
}