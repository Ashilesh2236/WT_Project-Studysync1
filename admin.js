/* ------------------------------------------------------
   StudySync - Admin Panel Logic
------------------------------------------------------- */

const taskKey = "studysync_tasks";
const logKey = "studysync_logs";
const subjectKey = "studysync_subjects";

function getTasks() {
    return JSON.parse(localStorage.getItem(taskKey)) || [];
}

function getSubjects() {
    return JSON.parse(localStorage.getItem(subjectKey)) || [];
}

function getLogs() {
    return JSON.parse(localStorage.getItem(logKey)) || [];
}

/* ------------------------------------------------------
   Admin Dashboard Counters
------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    
    // On admin dashboard.html
    if (document.getElementById("adminTotalTasks")) {
        const tasks = getTasks();
        const subjects = getSubjects();
        const logs = getLogs();

        document.getElementById("adminTotalTasks").innerText = tasks.length;
        document.getElementById("adminTotalSubjects").innerText = subjects.length;
        document.getElementById("adminTotalLogs").innerText = logs.length;
    }

    /* ------------------------------------------------------
       Admin Manage Tasks Page
    ------------------------------------------------------- */
    const adminList = document.getElementById("adminTaskList");

    if (adminList) {
        const tasks = getTasks();

        if (tasks.length === 0) {
            adminList.innerHTML = `<p class="text-muted">No tasks available.</p>`;
            return;
        }

        tasks.forEach(task => {
            adminList.innerHTML += `
                <div class="col-md-4">
                    <div class="card p-3 shadow-sm">
                        <h5>${task.title}</h5>
                        <p class="text-muted">${task.subject}</p>
                        <small>Due: ${task.date}</small>

                        <div class="mt-3 d-flex justify-content-between">
                            <a href="../edit-task.html?id=${task.id}" class="btn btn-primary btn-sm">Edit</a>
                            <button class="btn btn-danger btn-sm" onclick="adminDeleteTask(${task.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    /* ------------------------------------------------------
       Admin Logs Page
    ------------------------------------------------------- */
    const logList = document.getElementById("logList");
    const clearBtn = document.getElementById("clearLogs");

    if (logList) {
        const logs = getLogs();

        if (logs.length === 0) {
            logList.innerHTML = `<li class="list-group-item text-muted">No activity logs found.</li>`;
        } else {
            logs.forEach(log => {
                logList.innerHTML += `
                    <li class="list-group-item">
                        <strong>${log.action}</strong> - ${log.detail}
                        <br><small class="text-muted">${log.time}</small>
                    </li>
                `;
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                if (!confirm("Clear all system logs?")) return;

                localStorage.removeItem(logKey);
                window.location.reload();
            });
        }
    }

});

/* ------------------------------------------------------
   Delete Task (Admin Side)
------------------------------------------------------- */
function adminDeleteTask(id) {
    if (!confirm("Delete this task?")) return;

    let tasks = getTasks();
    let task = tasks.find(t => t.id === id);

    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(taskKey, JSON.stringify(tasks));

    // Log event
    let logs = getLogs();
    logs.push({
        action: "Admin Deleted Task",
        detail: task.title,
        time: new Date().toLocaleString()
    });
    localStorage.setItem(logKey, JSON.stringify(logs));

    window.location.reload();
}
