//=======================================================
// Dependencies
//=======================================================
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/notes');

//=======================================================
// Parse incoming JSON data
//=======================================================
app.use(express.json());
app.use(express.static('public'));

//=======================================================
// Routes
//=======================================================

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
// });

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.id) {
      filteredResults = filteredResults.filter(note => note.id === query.id);
    }

    return filteredResults;
  }

app.get('/api/notes', (req, res) => {

    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    console.log(req.query)
    res.json(results);
});

app.post("/notes", (req, res) => {
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

  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});