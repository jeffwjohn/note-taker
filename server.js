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

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
    }

function deleteNote(note, notesArray) {
    console.log('ID:', note.id);
    console.log('Before:', notesArray);
    notesArray.splice(note.id, 1);
    console.log('After:', notesArray)
    fs.writeFileSync(
        path.join(__dirname, './db/notes.json'),
        JSON.stringify({
            notes: notesArray
        }, null, 2)
    );
    return result;
    
    
     
     
    //  fs.writeFileSync(
    //     path.join(__dirname, './db/notes.json'),
    //     JSON.stringify({
    //         notes: notesArray
    //     }, null, 2)
    // );
    // // return finished code to post route for response
    // return body;
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
   
    res.json(results);
});

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    // console.log(req.body);
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

app.delete("/api/notes/:id",  (req, res) => {
   
    const id = req.params.id;
    console.log(id);
    res.json(id);
//   const index = notes.findIndex((note, index) => note.id == id);

//   notes.splice(index, 1);

//   return res.send();
    
//   const note = findById(req.params.id, notes);
//   if (note) {
//       console.log('Note:', note);
//       const result = deleteNote(note, notes);
//       res.json(result);
//   } else {
//     res.send(404);
//   }
  

});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});