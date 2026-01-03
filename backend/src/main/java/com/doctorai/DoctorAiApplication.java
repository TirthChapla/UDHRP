package com.doctorai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DoctorAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoctorAiApplication.class, args);
    }
}
