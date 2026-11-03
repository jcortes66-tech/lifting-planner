const express = require("express");
const db = require("./db");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the Node.js backend" });
});

app.listen(PORT, () => {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM exercises").get();
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Database connected — ${count} exercise(s) in the exercises table`);
});
