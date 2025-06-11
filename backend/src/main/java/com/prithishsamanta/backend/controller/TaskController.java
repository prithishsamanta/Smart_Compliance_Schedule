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
import java.util.stream.Collectors;

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
        List<Task> tasks = taskService.getTasksByDueDate();
        System.out.println("Tasks with files: " + tasks.stream()
            .filter(task -> task.getFileName() != null)
            .map(task -> task.getId() + ": " + task.getFileName())
            .collect(Collectors.joining(", ")));
        return tasks;
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

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateTaskWithFile(
            @PathVariable Long id,
            @RequestParam("task") String taskJson,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Task updatedTask = objectMapper.readValue(taskJson, Task.class);

            if (file != null && !file.isEmpty()) {
                updatedTask.setFileName(file.getOriginalFilename());
                updatedTask.setFileType(file.getContentType());
                updatedTask.setFileData(file.getBytes());
            }

            Task savedTask = taskService.updateTask(id, updatedTask);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating task: " + e.getMessage());
        }
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