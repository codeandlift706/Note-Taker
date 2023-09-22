//require express
const express = require('express');
const path = require('path'); //this is for...
const fs = require('fs'); //this is for the readFile & writeToFile functions--data to persist beyond server

// Helper method for generate unique ids --to put in body of get/post reqs functions!!!!!!
const uuid = require('./helpers/uuid');

//boilerplate middleware
const PORT = 3001;
const app = express(); //create instance of express

app.use(express.json()); //when we make reqs, we can use json format AND
app.use(express.urlencoded({ extended: true })); //when we make reqs, we can use urlencoded format

app.use(express.static('public')); //so long as we have a file titled "index" in the public folder

//this below is not needed if we have line 16
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET * should return the index.html file.
// * is a wildcard, will return the index.html as indicated by "/"
app.get('*', (req, res) => {
    res.send('<a href="/">Oopsie daisy! Nothing to see here. Navigate back to the homepage?</a>');
});



//POST /api/notes should receive a new note to save on the req body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {

    //send a message to the client that req has been received to post a note
    // res.status(200).json(`${req.method} request received to post a note.`);

    //log this req to the terminal that the client has reqed to post a note
    console.info(`${req.method} request received to post a note.`)

    //destructure for the items in req.body
    const { title, text } = req.body

    //if all the required properties are present,
    if (title && text) {

        //variable where title value = title property, text value = text property
        //structure note with structure and content needed
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        console.log(newNote);

        //should receive a new note to save on the req body--convert data to a string so we can save it, writeFile only wants strings
        const stringNotes = JSON.stringify(newNote);

        //we read the old file, save the old note. we then parse the stringed note

        //write the JSON string to the db.json file
        fs.writeFile(`./db/db.json`, stringNotes, (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json('Error in posting note');
            }
            else {
                console.log('A new note has been written to JSON file')

                //build a response object
                const response = {
                    status: 'success',
                    body: newNote,
                };
                //readfile, parse the data since its a string, then create array and push notes into it. Use spread method to put in new notes into array with old notes
                notesArray  //SPREAD!!!!!!

                //then return the new note to the client. res.json is like pushing the send button on the email
                console.log(response);
                return res.status(201).json(response);
            }
        });
    } else {
        res.status(500).json('Error in posting note'); //if we don't get the content of note (title,text), error
    }
});



//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {

    //read the db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => { //file, encoding, callback function
        if (err) {
            console.error(err);
        } else {
            return data;
        }
    });
});






//server listener, the server's job is to listen for reqs
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);