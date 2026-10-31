package com.github.umycael.analisadorvideos.service;

import com.github.umycael.analisadorvideos.exception.VideoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
public class VideoDownloadService {

    private final String ytDlpPath;

    public VideoDownloadService(@Value("${ytdlp.path:yt-dlp}") String ytDlpPath) {
        this.ytDlpPath = ytDlpPath;
    }

    public Path baixarAudio(String url) {
        try {
            Path pasta = Files.createTempDirectory("analisador-");
            String nome = UUID.randomUUID().toString();

            List<String> comando = List.of(
                    ytDlpPath,
                    "--no-playlist",
                    "-x",
                    "--audio-format", "mp3",
                    "--postprocessor-args", "-ac 1 -ar 16000 -b:a 32k",
                    "-o", pasta.resolve(nome + ".%(ext)s").toString(),
                    url
            );

            Process processo = new ProcessBuilder(comando)
                    .redirectErrorStream(true)
                    .start();

            String log = new String(processo.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int codigo = processo.waitFor();

            Path audio = pasta.resolve(nome + ".mp3");
            if (codigo != 0 || !Files.exists(audio)) {
                throw new VideoException("Não foi possível baixar o áudio. Detalhe: " + log);
            }
            return audio;

        } catch (IOException e) {
            throw new VideoException("Erro ao executar o yt-dlp. Ele está instalado?", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new VideoException("O download foi interrompido.", e);
        }
    }
}