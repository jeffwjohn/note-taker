//=======================================================
// Dependencies
//=======================================================
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

//=======================================================
// Routes
//=======================================================

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.post("/notes", (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
      res.status(400).send("The note is not properly formatted.");
    } else {
      const note = createNewNote(req.body, notes);
      res.json(note);
    }
  });