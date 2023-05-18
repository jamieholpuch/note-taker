// Import dependencies
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const noteData = require('./db/db')
const uuid = require('./helpers/uuid');
const fs = require('fs');

//import middleware
app.use(express.static('public'));
app.use(express.json())


//GET routes
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

app.get('/notes.html', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

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
      upvotes: Math.floor(Math.random() * 100),
      review_id: uuid(),
    };

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote);

    // Write the string to a file
    fs.writeFile(`./db/${newNote.title}.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Review for ${newNote.title} has been written to JSON file`
          )
    );

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

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);