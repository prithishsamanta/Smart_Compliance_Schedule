package com.prithishsamanta.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import com.theokanning.openai.service.OpenAiService;

@Configuration
public class OpenAiConfig {
    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Bean
    public OpenAiService openAiService() {
        return new OpenAiService(openAiApiKey);
    }
}
