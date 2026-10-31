package com.github.umycael.analisadorvideos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AnalisadorvideosApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalisadorvideosApplication.class, args);
	}
}