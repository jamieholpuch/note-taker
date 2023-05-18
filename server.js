// Import dependencies
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const noteData = require('./db/db')
const uuid = require('./helpers/uuid');
const fs = require('fs');

//import middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET routes
app.get('/notes', (req, res) => {
 res.sendFile(path.join(__dirname, '/public/notes.html'))
 // Log our request to the terminal
 console.info(`${req.method} request received to get notes`)
});

app.get('/api/notes', (req, res) => 
  res.json(noteData)
);

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid()
    };    

    // Write the string to a file
    fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
             ?console.error(writeErr)
             : console.info("Successfully updated notes!")
        );
      };
      });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);