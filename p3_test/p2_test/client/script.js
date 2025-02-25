document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;

    const response = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
    });

    const result = await response.json();
    alert(`Task added: ${result.description}`);
    document.getElementById("description").value = ""; // Clear input
    fetchTasks(); // Refresh task list
});

async function fetchTasks() {
    const response = await fetch("http://localhost:8000/tasks");
    const data = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="task-text">${task.description}</span>
            <span class="task-id">ID: ${task.id}</span>
        `;
        taskList.appendChild(li);
    });
}

// Fetch tasks on page load
fetchTasks();
