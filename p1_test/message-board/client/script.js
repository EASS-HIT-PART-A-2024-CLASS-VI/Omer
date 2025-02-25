const API_URL = "http://localhost:5000";

// Function to load and display messages
async function loadMessages() {
    try {
        const response = await fetch(`${API_URL}/messages`);
        const data = await response.json();

        // Ensure messages exist
        if (data.messages && data.messages.length > 0) {
            const list = document.getElementById("messages");
            list.innerHTML = data.messages.map(msg => `<li>${msg}</li>`).join("");
        } else {
            console.warn("No messages found in Redis.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Load messages when the page loads
window.onload = loadMessages;
