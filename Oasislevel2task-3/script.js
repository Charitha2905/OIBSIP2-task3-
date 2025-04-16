document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const pendingTasksList = document.getElementById('pending-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    
    renderTasks();
    
    
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                addedAt: new Date().toISOString(),
                completedAt: null
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }
    
    function renderTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';
        
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            if (task.completed) {
                completedTasksList.appendChild(taskElement);
            } else {
                pendingTasksList.appendChild(taskElement);
            }
        });
    }
    
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;
        
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-text';
        taskDiv.textContent = task.text;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'task-time';
        timeDiv.textContent = formatTime(task.addedAt, task.completedAt);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        if (!task.completed) {
            const completeBtn = document.createElement('button');
            completeBtn.className = 'task-btn complete-btn';
            completeBtn.textContent = '✓';
            completeBtn.addEventListener('click', () => toggleComplete(task.id));
            actionsDiv.appendChild(completeBtn);
        }
        
        const editBtn = document.createElement('button');
        editBtn.className = 'task-btn edit-btn';
        editBtn.textContent = '✎';
        editBtn.addEventListener('click', () => editTask(task.id));
        actionsDiv.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(taskDiv);
        li.appendChild(timeDiv);
        li.appendChild(actionsDiv);
        
        return li;
    }
    
    function toggleComplete(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;
            saveTasks();
            renderTasks();
        }
    }
    
    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            const newText = prompt('Edit your task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    }
    
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function formatTime(addedAt, completedAt) {
        const addedDate = new Date(addedAt);
        let timeString = `Added: ${addedDate.toLocaleString()}`;
        
        if (completedAt) {
            const completedDate = new Date(completedAt);
            timeString += ` | Completed: ${completedDate.toLocaleString()}`;
        }
        
        return timeString;
    }
});