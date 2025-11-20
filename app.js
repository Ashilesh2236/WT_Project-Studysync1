/* ------------------------------------------------------
   StudySync - Main App Logic
------------------------------------------------------- */

const taskKey = "studysync_tasks";
const logKey = "studysync_logs";

function getTasks() {
    return JSON.parse(localStorage.getItem(taskKey)) || [];
}

function saveTasks(tasks) {
    localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function logEvent(action, detail = "") {
    let logs = JSON.parse(localStorage.getItem(logKey)) || [];
    logs.push({
        action,
        detail,
        time: new Date().toLocaleString()
    });
    localStorage.setItem(logKey, JSON.stringify(logs));
}

/* ------------------------------------------------------
   Add Task Logic
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    const addForm = document.getElementById("addTaskForm");

    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = document.getElementById("taskTitle").value.trim();
            const description = document.getElementById("taskDescription").value.trim();
            const subject = document.getElementById("taskSubject").value;
            const date = document.getElementById("taskDate").value;

            let tasks = getTasks();

            tasks.push({
                id: Date.now(),
                title,
                description,
                subject,
                date,
                completed: false
            });

            saveTasks(tasks);
            logEvent("Task Added", title);

            alert("Task added successfully!");
            window.location.href = "view-task.html";
        });
    }

    /* ------------------------------------------------------
       Edit Task Logic
    ------------------------------------------------------- */
    if (window.location.pathname.includes("edit-task.html")) {
        const params = new URLSearchParams(window.location.search);
        const taskId = parseInt(params.get("id"));

        let tasks = getTasks();
        let task = tasks.find(t => t.id === taskId);

        if (!task) {
            alert("Task not found");
            window.location.href = "view-task.html";
        }

        document.getElementById("editTitle").value = task.title;
        document.getElementById("editDescription").value = task.description;
        document.getElementById("editSubject").value = task.subject;
        document.getElementById("editDate").value = task.date;

        document.getElementById("editTaskForm").addEventListener("submit", (e) => {
            e.preventDefault();

            task.title = document.getElementById("editTitle").value.trim();
            task.description = document.getElementById("editDescription").value.trim();
            task.subject = document.getElementById("editSubject").value;
            task.date = document.getElementById("editDate").value;

            saveTasks(tasks);
            logEvent("Task Edited", task.title);

            alert("Task updated!");
            window.location.href = "view-task.html";
        });
    }

    /* ------------------------------------------------------
       View All Tasks (Filtering + Cards + Pagination)
    ------------------------------------------------------- */
    const listContainer = document.getElementById("taskList");

    if (listContainer) {
        let tasks = getTasks();
        let currentPage = 1;
        const itemsPerPage = 6;

        const filterSubject = document.getElementById("filterSubject");
        const filterStatus = document.getElementById("filterStatus");
        const searchInput = document.getElementById("searchTask");

        function applyFilters() {
            let filtered = [...tasks];

            // Filter by subject
            if (filterSubject.value !== "all") {
                filtered = filtered.filter(t => t.subject === filterSubject.value);
            }

            // Filter by status
            if (filterStatus.value === "completed") filtered = filtered.filter(t => t.completed);
            if (filterStatus.value === "pending") filtered = filtered.filter(t => !t.completed);

            // Search
            const search = searchInput.value.toLowerCase();
            filtered = filtered.filter(t => t.title.toLowerCase().includes(search));

            return filtered;
        }

        function loadTasks() {
            listContainer.innerHTML = "";
            let filteredTasks = applyFilters();

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            const pageTasks = filteredTasks.slice(start, end);

            if (pageTasks.length === 0) {
                listContainer.innerHTML = `<p class="text-muted">No tasks available.</p>`;
                return;
            }

            pageTasks.forEach(task => {
                let statusClass = task.completed ? "completed" : "pending";
                listContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card task-card ${statusClass} p-3 shadow-sm">
                            <h5>${task.title}</h5>
                            <p class="text-muted">${task.subject}</p>
                            <small>Due: ${task.date}</small>

                            <div class="mt-3 d-flex justify-content-between">
                                <a href="edit-task.html?id=${task.id}" class="btn btn-primary btn-sm">Edit</a>
                                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Pagination
        document.getElementById("nextPage").addEventListener("click", () => {
            currentPage++;
            loadTasks();
        });

        document.getElementById("prevPage").addEventListener("click", () => {
            if (currentPage > 1) currentPage--;
            loadTasks();
        });

        // Filters
        filterSubject.addEventListener("change", loadTasks);
        filterStatus.addEventListener("change", loadTasks);
        searchInput.addEventListener("input", loadTasks);

        loadTasks();
    }

});

/* ------------------------------------------------------
   Delete Task
------------------------------------------------------- */
function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    let tasks = getTasks();
    let task = tasks.find(t => t.id === id);

    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);

    logEvent("Task Deleted", task.title);
    window.location.reload();
}

/* ------------------------------------------------------
   Dashboard Summary (User Side)
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("totalTasks")) {
        let tasks = getTasks();

        document.getElementById("totalTasks").innerText = tasks.length;
        document.getElementById("upcomingTasks").innerText =
            tasks.filter(t => !t.completed).length;
        document.getElementById("completedTasks").innerText =
            tasks.filter(t => t.completed).length;
    }
});
