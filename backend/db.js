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

  -- Each row is one logged-in session. 
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
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

db.prepare("UPDATE exercises SET name = 'Barbell Bench Press' WHERE name = 'Bench Press'").run();

// Full exercise catalog, grouped by muscle group to match the Guides tab.
const EXERCISES = [
  ["Barbell Back Squat", "Legs"],
  ["Romanian Deadlift (RDL)", "Legs"],
  ["Lat Pulldown", "Back"],
  ["Seated Cable Row", "Back"],
  ["Incline Dumbbell Press", "Chest"],
  ["Cable Chest Fly", "Chest"],
  ["Barbell Bench Press", "Chest"],
  ["Dumbbell Shoulder Press", "Shoulders"],
  ["Dumbbell Lateral Raise", "Shoulders"],
  ["Dumbbell Bicep Curl", "Arms"],
  ["Tricep Rope Pushdown", "Arms"],
  ["Plank", "Core"],
  ["Hanging Knee Raise", "Core"],
];

const insertExercise = db.prepare(
  "INSERT OR IGNORE INTO exercises (name, muscle_group) VALUES (?, ?)"
);
for (const [name, muscleGroup] of EXERCISES) {
  insertExercise.run(name, muscleGroup);
}

module.exports = db;

// Add the `name` column to users 
const userColumns = db.prepare("PRAGMA table_info(users)").all();
if (!userColumns.some((column) => column.name === "name")) {
  db.exec("ALTER TABLE users ADD COLUMN name TEXT");
}