package com.prithishsamanta.backend.service;

import com.prithishsamanta.backend.model.Task;
import com.prithishsamanta.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        updateTaskStatuses(tasks);
        return tasks;
    }

    public List<Task> getTasksByDueDate() {
        LocalDate today = LocalDate.now();
        List<Task> tasks = taskRepository.findByDueDate(today);
        updateTaskStatuses(tasks);
        return tasks;
    }

    public Task getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            updateTaskStatus(task);
        }
        return task;
    }

    @Transactional
    public Task saveTask(Task task) {
        updateTaskStatus(task);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return null;

        task.setHeading(updatedTask.getHeading());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());
        task.setDueTime(updatedTask.getDueTime());
        task.setPeople(updatedTask.getPeople());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        
        updateTaskStatus(task);
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private void updateTaskStatuses(List<Task> tasks) {
        for (Task task : tasks) {
            updateTaskStatus(task);
        }
    }

    private void updateTaskStatus(Task task) {
        if (task.getStatus().equals("Completed")) {
            return; // Don't change status of completed tasks
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDateTime = LocalDateTime.of(task.getDueDate(), task.getDueTime());

        if (now.isAfter(dueDateTime)) {
            task.setStatus("Over Due");
        }
    }
} 