package com.prithishsamanta.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import com.prithishsamanta.backend.model.Task;
import com.prithishsamanta.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // @GetMapping("/currentDate")
    // public List<Task> getTasksByCurrentDate(){
    //     try {
    //         LocalDate today = LocalDate.now();
    //         System.out.println("Current date: " + today);
            
    //         List<Task> allTasks = taskRepository.findAll();
    //         List<Task> todayTasks = new ArrayList<>();
            
    //         for (Task task : allTasks) {
    //             if (task.getDueDate() != null && task.getDueDate().equals(today)) {
    //                 System.out.println("Found task for today: " + task.getHeading() + " with due date: " + task.getDueDate());
    //                 todayTasks.add(task);
    //             }
    //         }
            
    //         System.out.println("Total tasks found for today: " + todayTasks.size());
    //         return todayTasks;
    //     } catch(Exception e) {
    //         System.out.println("Error in getTasksByCurrentDate: " + e.getMessage());
    //         e.printStackTrace();
    //         return new ArrayList<>();
    //     }
    // }

    @GetMapping("/dueDate")
    public List<Task> getTasksByDueDate() {
        LocalDate today = LocalDate.now();
        List<Task> allTasks = taskRepository.findAll();
        List<Task> todayTasks = new ArrayList<>();
        for (Task task : allTasks) {
            if (task.getDueDate() != null && task.getDueDate().equals(today)) {
                todayTasks.add(task);
            }
        }
        return todayTasks;
    }

    @GetMapping
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    // infroms spring that this endpoint accepts multipart/form-data which is used to upload files
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
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating task: " + e.getMessage());
        }
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

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null || task.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + task.getFileName() + "\"")
                .header("Content-Type", task.getFileType())
                .body(task.getFileData());
    }
}