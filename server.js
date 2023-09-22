//require express
const express = require('express');
const path = require('path'); //this is for...
const fs = require('fs'); //this is for the readFile & writeToFile functions--data to persist beyond server

// Helper method for generate unique ids --to put in body
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


//POST /api/notes should receive a new note to save on the req body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved 
//(look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {

    //log this req to the terminal that the client has requested to post a note
    console.info(`${req.method} request received to post a note.`)

    //destructure for the items in req.body
    const { title, text } = req.body;

    //if all the required properties are present,
    if (title && text) {

        //variable where title value = title property, text value = text property
        //structure note with structure and content needed
        const note = {
            title,
            text,
            id: uuid(),
        };

        // BEFORE ADDING IN A NEW NOTE, READ THE FILE FOR OLD NOTES
        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into javascript object with JSON parse
                const parsedNotes = JSON.parse(data);

                //parsedNotes = array
                //add new note to the array
                parsedNotes.push(note);

                //NOW THIS WRITES THE OLD AND NEW NOTES TO THE FILE, BUT WRITEFILE ONLY TAKES STRINGS
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes),
                    (writeErr) =>
                        writeErr ? console.error(err) : console.info('A new note has been written to JSON file')
                );
            }
        });

        //NOW FOR THE CLIENT ---> build a response object
        const response = {
            status: 'success',
            body: note,
        };

        //then return the new note to the client. res.json is like pushing the send button on the email
        console.log(response);
        return res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});


//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {

    //read the db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => { //file, encoding, callback function. readFile reads the data as a string
        if (err) {
            console.error(err);
        } else {
            return res.status(201).json(JSON.parse(data)); //we have to parse the data and turn it into JSON
        }
    });
});



//GET * should return the index.html file.
// * is a wildcard, will return the index.html as indicated by "/"
app.get('*', (req, res) => {
    res.send('<a href="/">Oopsie daisy! Nothing to see here. Navigate back to the homepage?</a>');
});


//server listener, the server's job is to listen for reqs
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);