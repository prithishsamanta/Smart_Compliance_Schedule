package com.prithishsamanta.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.prithishsamanta.backend.model.Task;
import com.prithishsamanta.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task){
        return taskRepository.save(task);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable int id){
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
        task.setPeopleInvolved(updatedTask.getPeopleInvolved());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        task.setFileName(updatedTask.getFileName());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}