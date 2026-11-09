const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lifting.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    muscle_group TEXT
  );

  CREATE TABLE IF NOT EXISTS logged_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    exercise_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    rpe INTEGER,
    logged_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
  );
`);

// Seed one starter exercise if the table is empty, so there's
// something to log against before a "manage exercises" feature exists.
const { count } = db.prepare("SELECT COUNT(*) AS count FROM exercises").get();
if (count === 0) {
  db.prepare(
    "INSERT INTO exercises (name, muscle_group) VALUES (?, ?)"
  ).run("Bench Press", "Chest");
}

module.exports = db;
