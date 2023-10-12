document.addEventListener('DOMContentLoaded', function () {
    showTodo();

    const taskInput = document.getElementById('task');
    const taskForm = document.getElementById('taskForm');

    if (taskInput && taskForm) {
        taskInput.addEventListener('input', function () {
            updateCharacterCount();
        });

        taskForm.addEventListener('submit', function (event) {
            event.preventDefault();
            addTask();
        });
    }
});

function updateCharacterCount() {
    const input = document.getElementById('task');
    const charCountElement = document.getElementById('charCount');
    charCountElement.textContent = `${input.value.length}/30`;
}

function addTask() {
    const taskInput = document.getElementById('task');
    const filterDropdown = document.getElementById('filterDropdown');
    const taskBox = document.querySelector('.task-box');

    const taskName = taskInput.value.trim();
    const editingTaskId = taskInput.getAttribute('data-editing');

    if (taskName) {
        if (editingTaskId) {
            const taskElement = document.getElementById(editingTaskId);
            taskElement.querySelector('p').innerText = taskName;
            taskInput.removeAttribute('data-editing');
        } else {
            const taskId = `task${new Date().getTime()}`;
            const taskHTML = `
                <li class="task" id="${taskId}">
                    <label class="task-label">
                        <input type="checkbox" id="${taskId}" onchange="toggleTaskCompletion('${taskId}')">
                        <p>${taskName}</p>
                    </label>
                    <div class="icons">
                        <i class="fas fa-edit" onclick="editTask('${taskId}')"></i>
                        <i class="fas fa-trash-alt" onclick="deleteTask('${taskId}', '${filterDropdown.value}')"></i>
                    </div>
                </li>
            `;
            taskBox.insertAdjacentHTML('beforeend', taskHTML);
        }

        taskInput.value = '';
        updateCharacterCount();
        updateLocalStorage();
        showTodo();
    }
}


function toggleTaskCompletion(taskId) {
    const taskElement = document.getElementById(taskId);
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const icons = taskElement.querySelector('.icons');
    const editIcon = icons.querySelector('.fa-edit');

    if (checkbox.checked) {
        taskElement.classList.add('completed');
        taskElement.style.backgroundColor = '#e0f7f0';
        editIcon.style.display = 'none';
    } else {
        taskElement.classList.remove('completed');
        taskElement.style.backgroundColor = '';
        editIcon.style.display = 'inline-block';
    }

    updateLocalStorage();
}

function editTask(taskId) {
    const taskInput = document.getElementById('task');
    const taskElement = document.getElementById(taskId);
    const taskName = taskElement.querySelector('p').innerText;

    taskInput.value = taskName;
    taskInput.setAttribute('data-editing', taskId);
    taskInput.focus();
}

function deleteTask(taskId, filter) {
    const taskElement = document.getElementById(taskId);
    taskElement.remove();
    updateCharacterCount();
    updateLocalStorage();
    showTodo();
}

function clearAllTasks() {
    const taskBox = document.querySelector('.task-box');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterValue = filterDropdown.value;

    if (filterValue === 'all') {
        taskBox.innerHTML = '';
    } else {
        const tasks = taskBox.querySelectorAll('.task');
        tasks.forEach(task => {
            const isCompleted = task.classList.contains('completed');

            if ((filterValue === 'completed' && isCompleted) || (filterValue === 'pending' && !isCompleted)) {
                task.remove();
            }
        });
    }

    updateCharacterCount();
    updateLocalStorage();
    showTodo();
}

function updateLocalStorage() {
    const taskBox = document.querySelector('.task-box');
    const tasks = taskBox.innerHTML;
    localStorage.setItem('tasks', tasks);

    const taskElements = taskBox.querySelectorAll('.task');
    taskElements.forEach(task => {
        const taskId = task.id;
        const isCompleted = task.classList.contains('completed');
        const taskData = { completed: isCompleted };
        localStorage.setItem(taskId, JSON.stringify(taskData));
    });
}

function showTodo() {
    const taskBox = document.querySelector('.task-box');
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        taskBox.innerHTML = savedTasks;

        const tasks = taskBox.querySelectorAll('.task');
        tasks.forEach(task => {
            const taskId = task.id;
            const storedTask = localStorage.getItem(taskId);
            if (storedTask) {
                const parsedTask = JSON.parse(storedTask);
                const isCompleted = parsedTask.completed;
                const checkbox = task.querySelector('input[type="checkbox"]');
                const icons = task.querySelector('.icons');
                const editIcon = icons.querySelector('.fa-edit');

                if (isCompleted) {
                    task.classList.add('completed');
                    task.style.backgroundColor = '#e0f7fa';
                    checkbox.checked = true;
                    editIcon.style.display = 'none';
                }
            }
        });
    } else {
        taskBox.innerHTML = '';
    }

    const filterDropdown = document.getElementById('filterDropdown');
    const tasks = taskBox.querySelectorAll('.task');

    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        const filterValue = filterDropdown.value;

        if (filterValue === 'all' || (filterValue === 'completed' && isCompleted) || (filterValue === 'pending' && !isCompleted)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
