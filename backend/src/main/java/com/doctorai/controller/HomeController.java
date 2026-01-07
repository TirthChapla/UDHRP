package com.doctorai.controller;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@Hidden
@Slf4j
public class HomeController {
    
    @GetMapping
    public Map<String, Object> home() {
        log.info("Health check endpoint called - API is running");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Doctor AI Backend API is running");
        response.put("version", "1.0.0");
        response.put("docs", "/swagger-ui.html");
        return response;
    }
}
