const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Memory mein users aur todos save honge (Server restart pe reset ho jayenge)
const users = [{ username: "Sneha", password: "123" }];
let todos = [];

// 1. REGISTER API
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find((u) => u.username === username);

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists!" });
  }

  users.push({ username, password });
  console.log("New User Registered:", username);
  res.json({ success: true, message: "Registration successful!" });
});

// 2. LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.json({ success: true, token: "mytoken123" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

// 3. GET TODOS
app.get("/todos", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }
  res.json(todos);
});

// 4. ADD TODO
app.post("/todos", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }
  const { task } = req.body;
  const newTodo = { id: Date.now(), task };
  todos.push(newTodo);
  res.json({ message: "Todo added", todo: newTodo });
});

// 5. DELETE TODO
app.delete("/todos/:id", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }
  const id = parseInt(req.params.id);
  todos = todos.filter((t) => t.id !== id);
  res.json({ message: "Deleted successfully" });
});

// 6. UPDATE TODO
app.put("/todos/:id", (req, res) => {
  if (req.headers.authorization !== "mytoken123") {
    return res.status(401).send("Unauthorized");
  }
  const id = parseInt(req.params.id);
  const { task } = req.body;
  todos = todos.map((t) => (t.id === id ? { ...t, task } : t));
  res.json({ message: "Updated successfully" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
