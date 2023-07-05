const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// API Routes

// GET route to retrieve all notes
app.get("/api/notes", (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// POST route to add a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const notes = getNotes();
  newNote.id = generateUniqueId();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// DELETE route to delete a note based on its ID
app.delete("/api/notes/:id", (req, res) => {
  const notes = getNotes();
  const filteredNotes = notes.filter((note) => note.id !== req.params.id);
  saveNotes(filteredNotes);
  res.json(filteredNotes);
});

// Helper Functions

// Read and parse the db.json file to retrieve notes
function getNotes() {
  const data = fs.readFileSync(path.join(__dirname, "db/db.json"), "utf8");
  return JSON.parse(data);
}

// Write notes to the db.json file
function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(notes));
}

// Generate a unique ID for each note
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000000);
}

// Start Server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
