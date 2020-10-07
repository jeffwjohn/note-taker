//=======================================================
// Dependencies
//=======================================================
const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const {
    notes
} = require('./db/notes');

//=======================================================
// Middleware
//=======================================================
// parse incoming string or array data
app.use(express.urlencoded({
    extended: true
}));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

//=======================================================
// Functions
//=======================================================
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

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/notes.json'),
        JSON.stringify({
            notes: notesArray
        }, null, 2)
    );
    // return finished code to post route for response
    return body;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}
//=======================================================
// Routes
//=======================================================
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {

    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    console.log(req.query)
    res.json(results);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// app.post("/notes", (req, res) => {
//     // set id based on what the next index of the array will be
//     req.body.id = notes.length.toString();

//     // if any data in req.body is incorrect, send 400 error back
//     if (!validateNote(req.body)) {
//       res.status(400).send("The note is not properly formatted.");
//     } else {
//       const note = createNewNote(req.body, notes);
//       res.json(note);
//     }
//   });

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {
        // add note to json file and notes array in this function
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});