const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the Node.js backend" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
