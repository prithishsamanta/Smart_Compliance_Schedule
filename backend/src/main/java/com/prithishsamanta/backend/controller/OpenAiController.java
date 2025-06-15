package com.prithishsamanta.backend.controller;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.prithishsamanta.backend.model.Task;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/ai")
public class OpenAiController {

    @Autowired
    private OpenAiService openAiService;

    @PostMapping("/create-task")
    public Task createTaskFromPrompt(@RequestBody String userPrompt) throws Exception {
        // Compose the prompt for GPT-3.5
        String prompt = "Extract the following fields from this task request and output as JSON: " +
                "heading, description, dueDate (YYYY-MM-DD), dueTime (HH:MM), people (email array), priority (1-9), status(in progress, completed, cancelled).\n" +
                "Text: \"" + userPrompt + "\"";

        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(
                    new ChatMessage("system", "You are a helpful assistant that extracts task information and returns it as JSON."),
                    new ChatMessage("user", prompt)
                ))
                .maxTokens(200)
                .temperature(0.0)
                .build();

        ChatCompletionResult completion = openAiService.createChatCompletion(chatCompletionRequest);

        // Get the response text (the structured JSON string)
        String jsonString = completion.getChoices().get(0).getMessage().getContent().trim();

        // Parse JSON manually to avoid Jackson date issues
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(jsonString);

        // Create Task object manually
        Task task = new Task();
        task.setHeading(jsonNode.get("heading").asText());
        task.setDescription(jsonNode.get("description").asText());
        
        // Parse date and time manually
        String dueDateStr = jsonNode.get("dueDate").asText();
        String dueTimeStr = jsonNode.get("dueTime").asText();
        
        task.setDueDate(LocalDate.parse(dueDateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        task.setDueTime(LocalTime.parse(dueTimeStr, DateTimeFormatter.ofPattern("HH:mm")));
        
        // Parse people array
        JsonNode peopleNode = jsonNode.get("people");
        List<String> people = new ArrayList<>();
        if (peopleNode.isArray()) {
            for (JsonNode personNode : peopleNode) {
                people.add(personNode.asText());
            }
        }
        task.setPeople(people);
        
        task.setPriority(jsonNode.get("priority").asInt());
        task.setStatus(jsonNode.get("status").asText());

        return task;
    }
}
