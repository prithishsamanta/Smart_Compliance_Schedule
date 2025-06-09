const API_URL = 'http://localhost:8080/api/tasks';

export const TaskService = {
    // Get all tasks
    getAllTasks: async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    getTasksByCurrentDate: async () => {
        try {
            const response = await fetch(`${API_URL}/dueDate`);
            if (!response.ok) throw new Error('Failed to fetch tasks by current date');
            return await response.json();
        }
        catch(error){
            console.error('Error fetching tasks by current date:', error);
            throw error;
        }
    },

    // Create a new task with file
    createTask: async (taskData, file) => {
        try {
            const formData = new FormData();
            formData.append('task', JSON.stringify(taskData));
            if (file) {
                formData.append('file', file);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to create task');
            return await response.json();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // Get a single task by ID
    getTaskById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch task');
            return await response.json();
        } catch (error) {
            console.error('Error fetching task:', error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (id, taskData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) throw new Error('Failed to update task');
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete task');
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    // Download a file
    downloadFile: async (taskId) => {
        try {
            const response = await fetch(`${API_URL}/${taskId}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            
            return response;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }
}; 