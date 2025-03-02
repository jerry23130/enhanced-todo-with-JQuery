const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());

let tasks = []; // Store tasks in memory

// Serve main page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Serve add task page
app.get("/add", (req, res) => {
    res.sendFile(__dirname + "/public/add.html");
});

// API to get tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// API to add a task
app.post("/add-task", (req, res) => {
    const task = req.body.task;
    if (task) {
        tasks.push({ text: task, done: false }); // Add task as an object
    }
    res.json(tasks);
});

// API to toggle task status
app.post("/toggle-task", (req, res) => {
    const { index, done } = req.body;
    if (typeof index === "number" && tasks[index]) {
        tasks[index].done = done;
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, error: "Invalid task index" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
