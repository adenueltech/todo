// Select elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const currentDate = document.getElementById('current-date');
const currentTime = document.getElementById('current-time');
const calendar = document.getElementById('calendar');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const reminderModal = new bootstrap.Modal(document.getElementById('reminderModal'));
const setReminderBtn = document.getElementById('set-reminder-btn');
let currentTaskForReminder = null;

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateDateTime();
    generateCalendar();
    loadTheme();
    setInterval(updateDateTime, 1000);
});

// Add event listeners
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
themeToggleBtn.addEventListener('click', toggleTheme);
setReminderBtn.addEventListener('click', setReminder);

// Function to add task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    // Create task element
    const taskItem = document.createElement('li');
    taskItem.classList.add('list-group-item', 'task');
    taskItem.innerHTML = `
        <button class="favorite-btn"><i class="fas fa-star"></i></button>
        ${taskText}
        <button class="reminder-btn"><i class="fas fa-bell"></i></button>
        <button class="delete-btn">X</button>
    `;

    // Add task to list
    taskList.appendChild(taskItem);

    // Save task to local storage
    saveTask(taskText);

    // Clear input
    taskInput.value = '';
}

// Function to handle task actions
function handleTaskActions(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.parentElement;
        removeTaskFromStorage(taskItem.textContent.trim());
        taskItem.remove();
    } else if (e.target.classList.contains('favorite-btn') || e.target.parentElement.classList.contains('favorite-btn')) {
        const taskItem = e.target.closest('.list-group-item');
        taskItem.classList.toggle('favorite');
        saveFavoriteTask(taskItem.textContent.trim(), taskItem.classList.contains('favorite'));
    } else if (e.target.classList.contains('reminder-btn') || e.target.parentElement.classList.contains('reminder-btn')) {
        currentTaskForReminder = e.target.closest('.list-group-item');
        $('#reminderModal').modal('show');
    }
}

// Function to toggle theme
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    saveTheme();
}

// Function to set reminder
function setReminder() {
    const reminderDatetime = document.getElementById('reminder-datetime').value;
    if (!reminderDatetime || !currentTaskForReminder) return;

    // Set a timeout for the reminder
    const reminderTime = new Date(reminderDatetime).getTime() - new Date().getTime();
    setTimeout(() => {
        alert(`Reminder: ${currentTaskForReminder.textContent.trim()}`);
    }, reminderTime);

    $('#reminderModal').modal('hide');
}

// Function to save task to local storage
function saveTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push({ text: task, favorite: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove task from local storage
function removeTaskFromStorage(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.filter(t => t.text !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to save favorite task
function saveFavoriteTask(task, isFavorite) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks = tasks.map(t => t.text === task ? { text: t.text, favorite: isFavorite } : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item', 'task');
        if (task.favorite) taskItem.classList.add('favorite');
        taskItem.innerHTML = `
            <button class="favorite-btn"><i class="fas fa-star"></i></button>
            ${task.text}
            <button class="reminder-btn"><i class="fas fa-bell"></i></button>
            <button class="delete-btn">X</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Function to update date and time
function updateDateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString();
    currentTime.textContent = now.toLocaleTimeString();
}

// Function to generate calendar
function generateCalendar() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Clear previous calendar
    calendar.innerHTML = '';

    // Fill the calendar with days
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        calendar.appendChild(dayCell);
    }
}

// Function to save theme to local storage
function saveTheme() {
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Function to load theme from local storage
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

