package com.prithishsamanta.backend.controller;

import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.CompletionResult;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class OpenAiController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/create-task")
    public String createTaskFromPrompt(@RequestBody String userPrompt) {
        // Compose the prompt for GPT-3.5
        String prompt = "Extract the following fields from this task request and output as JSON: " +
                "heading, description, dueDate (YYYY-MM-DD), dueTime (HH:MM), people (email array), priority (1-9), status(in progress, completed, cancelled).\n" +
                "Text: \"" + userPrompt + "\"";

        CompletionRequest completionRequest = CompletionRequest.builder()
                .model("gpt-3.5-turbo-instruct") // For best results, try both instruct and chat models
                .prompt(prompt)
                .maxTokens(200)
                .temperature(0.0)
                .build();

        CompletionResult completion = openAiService.createCompletion(completionRequest);

        // Return only the text (the structured JSON string)
        return completion.getChoices().get(0).getText().trim();
    }
}
