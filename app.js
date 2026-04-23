// State Management
let tasks = [];
let completedTasks = [];

const quadrantNames = {
    'do': 'Do First',
    'schedule': 'Schedule',
    'delegate': 'Delegate',
    'eliminate': 'Eliminate'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupDragAndDrop();
    
    // Global event listeners for modal
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeEditModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('edit-modal');
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') closeEditModal();
            else if (e.key === 'Enter' && !e.target.matches('textarea')) {
                e.preventDefault();
                saveTaskEdit();
            }
        }
    });
});

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('eisenhower_tasks_v2');
    const storedCompleted = localStorage.getItem('eisenhower_completed_v2');
    if (storedTasks) tasks = JSON.parse(storedTasks);
    if (storedCompleted) completedTasks = JSON.parse(storedCompleted);
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('eisenhower_tasks_v2', JSON.stringify(tasks));
    localStorage.setItem('eisenhower_completed_v2', JSON.stringify(completedTasks));
    updateStats();
}

// Add a new task from the global bar
function addTask() {
    const titleInput = document.getElementById('task-title');
    const dateInput = document.getElementById('task-date');
    const notesInput = document.getElementById('task-notes');
    const quadrantSelect = document.getElementById('task-quadrant');

    const text = titleInput.value.trim();

    if (text) {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            dueDate: dateInput.value || null,
            notes: notesInput.value.trim() || null,
            quadrant: quadrantSelect.value,
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        // Clear inputs
        titleInput.value = '';
        dateInput.value = '';
        notesInput.value = '';
        titleInput.focus();
    }
}

// Complete a task (moves to completed section)
function completeTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        completedTasks.unshift(task);
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
    }
}

// Restore a completed task
function restoreTask(id) {
    const taskIndex = completedTasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        const task = completedTasks[taskIndex];
        tasks.push(task);
        completedTasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
    }
}

// Delete a task (active or completed)
function deleteTask(id, isCompleted = false) {
    if (isCompleted) {
        completedTasks = completedTasks.filter(task => task.id !== id);
    } else {
        tasks = tasks.filter(task => task.id !== id);
    }
    saveTasks();
    renderTasks();
}

// Edit Modal Functions
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('edit-task-id').value = id;
    document.getElementById('edit-title').value = task.text;
    document.getElementById('edit-date').value = task.dueDate || '';
    document.getElementById('edit-notes').value = task.notes || '';

    document.getElementById('edit-modal').classList.add('show');
    document.getElementById('edit-title').focus();
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
}

function saveTaskEdit() {
    const id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const dueDate = document.getElementById('edit-date').value;
    const notes = document.getElementById('edit-notes').value.trim();

    if (!title) {
        document.getElementById('edit-title').focus();
        return;
    }

    const task = tasks.find(t => t.id === id);
    if (task) {
        task.text = title;
        task.dueDate = dueDate || null;
        task.notes = notes || null;
        saveTasks();
        renderTasks();
    }
    closeEditModal();
}

// Format date utility
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Render UI
function renderTasks() {
    // Clear current lists
    const quadrants = ['do', 'schedule', 'delegate', 'eliminate'];
    quadrants.forEach(q => {
        const list = document.getElementById(`list-${q}`);
        if (list) list.innerHTML = '';
    });

    // Populate active tasks
    tasks.forEach(task => {
        const list = document.getElementById(`list-${task.quadrant}`);
        if (list) {
            const taskElement = createTaskElement(task);
            list.appendChild(taskElement);
        }
    });

    renderCompletedTasks();
    updateStats();
}

// Create DOM element for an active task
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.draggable = true;
    div.dataset.id = task.id;

    let metaHtml = '';
    if (task.dueDate) {
        metaHtml = `<div class="task-meta"><i class='bx bx-calendar'></i> ${formatDate(task.dueDate)}</div>`;
    }

    let notesHtml = '';
    if (task.notes) {
        notesHtml = `<div class="task-notes-text">${escapeHTML(task.notes)}</div>`;
    }

    div.innerHTML = `
        <div class="task-content">
            <div class="task-header-row">
                <input type="checkbox" class="task-checkbox" onchange="completeTask('${task.id}')" aria-label="Complete task">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            ${metaHtml}
            ${notesHtml}
        </div>
        <div class="task-actions">
            <button class="action-btn edit-btn" onclick="openEditModal('${task.id}')" aria-label="Edit Task"><i class='bx bx-edit-alt'></i></button>
            <button class="action-btn delete-btn" onclick="deleteTask('${task.id}', false)" aria-label="Delete Task"><i class='bx bx-x'></i></button>
        </div>
    `;

    // Drag events
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    return div;
}

// Render completed tasks section
function renderCompletedTasks() {
    const section = document.getElementById('completed-section');
    const list = document.getElementById('completed-list');
    const count = document.getElementById('completed-count');

    if (completedTasks.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    count.textContent = completedTasks.length;

    list.innerHTML = completedTasks.map(task => `
        <div class="completed-task">
            <div class="task-info">
                <div class="task-title">${escapeHTML(task.text)}</div>
                <div class="task-meta">from ${quadrantNames[task.quadrant]}</div>
            </div>
            <button class="action-btn edit-btn" onclick="restoreTask('${task.id}')" title="Restore"><i class='bx bx-undo'></i></button>
            <button class="action-btn delete-btn" onclick="deleteTask('${task.id}', true)" title="Permanently Delete"><i class='bx bx-trash'></i></button>
        </div>
    `).join('');
}

function toggleCompleted() {
    const header = document.querySelector('.completed-header');
    const list = document.getElementById('completed-list');
    header.classList.toggle('collapsed');
    list.classList.toggle('hidden');
}

// Utility to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Drag and Drop Logic
let draggedTaskId = null;

function handleDragStart(e) {
    draggedTaskId = this.dataset.id;
    this.classList.add('dragging');
    setTimeout(() => this.style.display = 'none', 0);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.display = '';
    draggedTaskId = null;
    document.querySelectorAll('.quadrant').forEach(q => q.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const quadrant = e.currentTarget;
    quadrant.classList.remove('drag-over');
    
    const targetQuadrant = quadrant.dataset.quadrant;
    
    if (draggedTaskId && targetQuadrant) {
        const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
        if (taskIndex !== -1 && tasks[taskIndex].quadrant !== targetQuadrant) {
            tasks[taskIndex].quadrant = targetQuadrant;
            saveTasks();
            renderTasks();
        }
    }
}

function setupDragAndDrop() {
    const quadrants = document.querySelectorAll('.quadrant');
    quadrants.forEach(quadrant => {
        quadrant.addEventListener('dragleave', handleDragLeave);
    });
}

// Update UI statistics
function updateStats() {
    const statsEl = document.getElementById('task-stats');
    if (statsEl) {
        statsEl.textContent = `${tasks.length} active task${tasks.length !== 1 ? 's' : ''}`;
    }
}
