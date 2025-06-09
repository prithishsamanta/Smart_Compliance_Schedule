package com.prithishsamanta.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.prithishsamanta.backend.model.Task;
import com.prithishsamanta.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/dueDate")
    public List<Task> getTasksByDueDate() {
        return taskService.getTasksByDueDate();
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createTask(
            @RequestParam("task") String taskJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Task task = objectMapper.readValue(taskJson, Task.class);
            
            if (file != null && !file.isEmpty()) {
                task.setFileName(file.getOriginalFilename());
                task.setFileType(file.getContentType());
                task.setFileData(file.getBytes());
            }
            
            Task savedTask = taskService.saveTask(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating task: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        if (task == null || task.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + task.getFileName() + "\"")
                .header("Content-Type", task.getFileType())
                .body(task.getFileData());
    }
}