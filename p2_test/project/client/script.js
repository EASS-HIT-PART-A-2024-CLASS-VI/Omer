document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;

    const response = await fetch("http://localhost:8000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
    });

    const result = await response.json();
    document.getElementById("result").innerText = JSON.stringify(result, null, 2);
});

document.getElementById("getForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("getKey").value;

    const response = await fetch(`http://localhost:8000/data/${key}`);
    const result = await response.json();
    document.getElementById("result").innerText = JSON.stringify(result, null, 2);
});
