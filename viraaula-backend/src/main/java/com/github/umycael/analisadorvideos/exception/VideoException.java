package com.github.umycael.analisadorvideos.exception;

public class VideoException extends RuntimeException {

    public VideoException(String mensagem) {
        super(mensagem);
    }

    public VideoException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}