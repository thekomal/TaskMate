let tasks = [];

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Load tasks from localStorage
const loadTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    updateTaskList();
    updateProgress();
};

// Add or edit a task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text) {
        const editIndex = taskInput.getAttribute("data-edit-index");

        if (editIndex !== null) {
            tasks[parseInt(editIndex)].text = text; // Convert index to number
            taskInput.removeAttribute("data-edit-index");
        } else {
            tasks.push({ text: text, completed: false });
        }

        updateTaskList();
        updateProgress();
        saveTasks();
        taskInput.value = ''; // Clear input field
    }
};

// Update task list
const updateTaskList = () => {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} 
                        onchange="toggleTaskComplete(${index})"/>
                    <p>${task.text}</p>
                </div>
                <div class="icons">
                    <img src="./img/edit.png" onclick="editTask(${index})" alt="Edit"/>
                    <img src="./img/bin.png" onclick="deleteTask(${index})" alt="Delete"/> 
                </div>
            </div>
        `;
        taskList.appendChild(listItem);
    });
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateProgress();
    saveTasks();
};

// Delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateProgress();
    saveTasks();
};

// Edit task
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;
    taskInput.setAttribute("data-edit-index", index);
};

// Update progress bar
const updateProgress = () => {
    const progressBar = document.getElementById('progress');
    const numbers = document.getElementById('numbers');

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progressBar.style.width = `${progressPercentage}%`;
    numbers.textContent = `${completedTasks}/${totalTasks}`;

    // Trigger confetti when all tasks are completed
    if (completedTasks === totalTasks && totalTasks > 0) {
        blastConfetti();
    }
};

// Confetti effect when all tasks are completed
const blastConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 }, 200);
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 }, 400);
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 }, 600);
    fire(0.1, { spread: 120, startVelocity: 45 }, 800);
};

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

// Load tasks on page load
window.onload = loadTasks;
