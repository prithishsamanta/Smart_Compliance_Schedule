package com.prithishsamanta.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.prithishsamanta.backend.model.Task;
import com.prithishsamanta.backend.repository.TaskRepository;
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
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
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
            
            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating task: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id){
        return taskRepository.findById(id).orElse(null);
    }

    @GetMapping("/dueDate/{dueDate}")
    public List<Task> getTasksByDueDate(@PathVariable LocalDate dueDate){
        return taskRepository.findByDueDate(dueDate);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return null;
        
        task.setHeading(updatedTask.getHeading());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());
        task.setDueTime(updatedTask.getDueTime());
        task.setPeople(updatedTask.getPeople());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}