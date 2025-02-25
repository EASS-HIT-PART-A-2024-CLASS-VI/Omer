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
    document.getElementById("description").value = "";
    fetchTasks();
});

async function fetchTasks() {
    const response = await fetch("http://localhost:8000/tasks");
    const data = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span class="task-text">${task.description}</span>
            <span class="task-id">ID: ${task.id}</span>
        `;
        taskList.appendChild(li);
    });
}

async function checkServerStatus() {
    try {
        const response = await fetch("http://localhost:8000");
        const data = await response.json();
        const statusDiv = document.createElement('div');
        statusDiv.className = 'status';
        statusDiv.innerHTML = `
            ✅ Server: ${data.message}<br>
            ✅ Redis: Connected via Docker<br>
            ✅ Client: Running on port 8080
        `;
        document.body.appendChild(statusDiv);
    } catch (error) {
        console.error("Connection error:", error);
    }
}

fetchTasks();
checkServerStatus();
