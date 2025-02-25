const express = require("express");
const cors = require("cors");
const redis = require("redis");

const app = express();
const client = redis.createClient({ host: "redis", port: 6379 });

// ✅ Allow requests from any origin (fixes CORS error)
app.use(cors({ origin: "*" }));

// ✅ Enable JSON parsing
app.use(express.json());

// Store messages in Redis
app.post('/message', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    await client.rPush("messages", message);
    res.json({ success: true });
});

// Retrieve messages
app.get('/messages', async (req, res) => {
    const messages = await client.lRange("messages", 0, -1);
    res.json({ messages });
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
