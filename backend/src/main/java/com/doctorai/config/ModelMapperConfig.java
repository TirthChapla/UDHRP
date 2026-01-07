package com.doctorai.config;

import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class ModelMapperConfig {
    
    @Bean
    public ModelMapper modelMapper() {
        log.info("Configuring ModelMapper bean");
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setAmbiguityIgnored(true);
        log.debug("ModelMapper configured with skipNullEnabled=true, ambiguityIgnored=true");
        return modelMapper;
    }
}
