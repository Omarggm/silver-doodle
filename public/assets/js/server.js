const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

const dbPath = path.join(__dirname, "../../../db/db.json");

app.use(express.json());

//API endpoints to get notes
app.get("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read file" });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

//API endpoint to post notes
app.post("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read file" });
    }

    const notes = JSON.parse(data);
    const { title, text } = req.body; // Destructure the title and text fields from req.body

    const newNote = {
      title,
      text,
      id: Date.now(),
    };

    notes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to write file" });
      }

      res.json(newNote);
    });
  });
});

//API endpoint to delete notes
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read file" });
    }

    const notes = JSON.parse(data);
    const noteId = parseInt(req.params.id);

    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(dbPath, JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to write file" });
      }

      res.sendStatus(204);
    });
  });
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
