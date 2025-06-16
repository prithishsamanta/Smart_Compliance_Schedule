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
import com.prithishsamanta.backend.service.TaskService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/ai")
public class OpenAiController {

    @Autowired
    private OpenAiService openAiService;

    @Autowired
    private TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<?> createTaskFromPrompt(@RequestBody String userPrompt) throws Exception {
        // Compose the prompt for GPT-3.5
        String today=LocalDate.now().toString();
        // String prompt = "Extract the following fields from this task request and output as JSON: (today's date is "+today+")" +
        //         "heading, description, dueDate (YYYY-MM-DD), dueTime (HH:MM), people (email array), priority (1-9), status(in progress, completed, cancelled).\n" +
        //         "Text: \"" + userPrompt + "\"";

        String prompt = "If the user's request is a task, extract the following fields from this task request and output as JSON: (today's date is "+today+")" +
                "heading, description, dueDate (YYYY-MM-DD), dueTime (HH:MM), people (email array), priority (1-9), status(in progress, completed, cancelled).\n" + 
                "If the user asks for help, instructions, or something else, respond conversationally as a helpful assistant.\n" +
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

        // Get the response text
        String responseText = completion.getChoices().get(0).getMessage().getContent().trim();

        // Try to parse as JSON first
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode jsonNode = mapper.readTree(responseText);
            
            // Check if it has the required task fields
            if (jsonNode.has("heading") && jsonNode.has("dueDate") && jsonNode.has("dueTime")) {
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
                if (peopleNode != null && peopleNode.isArray()) {
                    for (JsonNode personNode : peopleNode) {
                        people.add(personNode.asText());
                    }
                }
                task.setPeople(people);
                
                task.setPriority(jsonNode.has("priority") ? jsonNode.get("priority").asInt() : 5);
                task.setStatus(jsonNode.has("status") ? jsonNode.get("status").asText() : "In Progress");

                Task savedTask = taskService.saveTask(task);
                return ResponseEntity.ok(savedTask);
            } else {
                // JSON but not a task - treat as help response
                return ResponseEntity.ok(Map.of("type", "help", "message", responseText));
            }
        } catch (Exception e) {
            // Not valid JSON - treat as conversational response
            return ResponseEntity.ok(Map.of("type", "help", "message", responseText));
        }
    }
}
