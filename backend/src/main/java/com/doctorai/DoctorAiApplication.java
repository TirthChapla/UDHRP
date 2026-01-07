package com.doctorai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@Slf4j
public class DoctorAiApplication {

    public static void main(String[] args) {
        log.info("========================================");
        log.info("Starting Doctor AI Application...");
        log.info("========================================");
        SpringApplication.run(DoctorAiApplication.class, args);
        log.info("========================================");
        log.info("Doctor AI Application started successfully!");
        log.info("========================================");
    }
}
