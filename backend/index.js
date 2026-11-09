const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the Node.js backend" });
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }

  // Hashing turns the password into something irreversible
  const password_hash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, password_hash);

  // Never send the password or its hash back in the response.
  res.status(201).json({ id: result.lastInsertRowid, email });
});

app.post("/api/logs", (req, res) => {
  const { exercise_id, weight, reps, rpe } = req.body;

  if (!Number.isInteger(exercise_id)) {
    return res.status(400).json({ error: "exercise_id is required and must be an integer" });
  }
  if (typeof weight !== "number" || weight <= 0) {
    return res.status(400).json({ error: "weight is required and must be a positive number" });
  }
  if (!Number.isInteger(reps) || reps <= 0) {
    return res.status(400).json({ error: "reps is required and must be a positive integer" });
  }
  if (rpe !== undefined && rpe !== null && (!Number.isInteger(rpe) || rpe < 1 || rpe > 10)) {
    return res.status(400).json({ error: "rpe must be an integer between 1 and 10" });
  }

  const exercise = db.prepare("SELECT id FROM exercises WHERE id = ?").get(exercise_id);
  if (!exercise) {
    return res.status(400).json({ error: `No exercise found with id ${exercise_id}` });
  }

  const result = db
    .prepare("INSERT INTO logged_sets (exercise_id, weight, reps, rpe) VALUES (?, ?, ?, ?)")
    .run(exercise_id, weight, reps, rpe ?? null);

  const created = db
    .prepare("SELECT * FROM logged_sets WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(created);
});

app.get("/api/logs", (req, res) => {
  const logs = db
    .prepare(
      `SELECT logged_sets.id, logged_sets.user_id, logged_sets.exercise_id,
              exercises.name AS exercise_name, logged_sets.weight,
              logged_sets.reps, logged_sets.rpe, logged_sets.logged_at
       FROM logged_sets
       JOIN exercises ON exercises.id = logged_sets.exercise_id
       ORDER BY logged_sets.logged_at DESC`
    )
    .all();

  res.json(logs);
});

app.listen(PORT, () => {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM exercises").get();
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`Database connected — ${count} exercise(s) in the exercises table`);
});
