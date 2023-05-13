// Import dependencies
const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const noteData = require('./db/db.json')
const uuid = require('./helpers/uuid');


app.use(express.static('public'));

app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/notes', (req, res) => res.sendFile(__dirname + '/public/notes.html'));
app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

if (title && text) {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        note_id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
    // Convert string into JSON object
    const parsedNotes = JSON.parse(data);
  
    // Add a new note
    parsedNotes.push(newNote);
  
    // Write updated notes back to the file
    fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 2),
        (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
} else {
    res.status(500).json('Error in posting note')
};

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);
});