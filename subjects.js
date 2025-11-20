/* ------------------------------------------------------
   StudySync - Subjects Logic
------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

    const key = "studysync_subjects";
    let subjects = JSON.parse(localStorage.getItem(key)) || [];

    const subjectForm = document.getElementById("subjectForm");
    const subjectList = document.getElementById("subjectList");
    const subjectName = document.getElementById("subjectName");
    const subjectAlert = document.getElementById("subjectAlert");
    const clearBtn = document.getElementById("clearSubjects");

    // Dropdowns (Add/Edit/View pages)
    const subjectSelects = document.querySelectorAll("#taskSubject, #editSubject, #filterSubject");

    function save() {
        localStorage.setItem(key, JSON.stringify(subjects));
        populateSelects();
        renderList();
    }

    function showAlert(msg, type = "success") {
        subjectAlert.innerHTML = `
            <div class="alert alert-${type} mt-2">${msg}</div>
        `;
        setTimeout(() => (subjectAlert.innerHTML = ""), 2000);
    }

    /* ------------------------------------------------------
       Render Subject List (Subjects Page)
    ------------------------------------------------------- */
    function renderList() {
        if (!subjectList) return;

        subjectList.innerHTML = "";

        if (subjects.length === 0) {
            subjectList.innerHTML = `<li class="list-group-item text-muted">No subjects added yet.</li>`;
            return;
        }

        subjects.forEach((s, i) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                ${s}
                <button class="btn btn-sm btn-danger" data-index="${i}">Delete</button>
            `;
            subjectList.appendChild(li);
        });

        // Delete subject
        subjectList.querySelectorAll("button[data-index]").forEach(button => {
            button.onclick = function () {
                if (!confirm("Delete this subject?")) return;

                subjects.splice(this.dataset.index, 1);
                save();
            };
        });
    }

    /* ------------------------------------------------------
       Populate Subject Dropdowns (Add/Edit/View pages)
    ------------------------------------------------------- */
    function populateSelects() {
        subjectSelects.forEach(select => {
            if (!select) return;

            let first = `<option value="">Select Subject</option>`;
            if (select.id === "filterSubject") {
                first = `<option value="all">All Subjects</option>`;
            }

            select.innerHTML = first;

            subjects.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s;
                opt.innerText = s;
                select.appendChild(opt);
            });
        });
    }

    /* ------------------------------------------------------
       Add Subject (Subjects Page)
    ------------------------------------------------------- */
    if (subjectForm) {
        subjectForm.addEventListener("submit", e => {
            e.preventDefault();

            const value = subjectName.value.trim();
            if (!value) return showAlert("Please enter subject name", "warning");

            subjects.push(value);
            subjectName.value = "";
            save();

            showAlert("Subject added successfully");
        });
    }

    /* ------------------------------------------------------
       Clear All Subjects
    ------------------------------------------------------- */
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (!confirm("Clear all subjects?")) return;

            subjects = [];
            save();
        });
    }

    // Initial Load
    populateSelects();
    renderList();

});
