//require express
const express = require('express');
const path = require('path'); //this is for...
const fs = require('fs'); //this is for the readFile & writeToFile functions

// Helper method for generate unique ids --to put in body of get/post requests functions!!!!!!
const uuid = require('./Develop/helpers/uuid');

//boilerplate middleware
const PORT = 3001;
const app = express(); //create instance of express

app.use(express.json()); //when we make requests, we can use json format AND
app.use(express.urlencoded({ extended: true })); //when we make requests, we can use urlencoded format

app.use(express.static('public')); //so long as we have a file titled "index" in the public folder

//this below is not needed if we have line 16
app.get('/', (request, response) =>
    response.sendFile(path.join(__dirname, '/Develop/public/index.html'))
);

//The following HTML routes should be created:

//GET * should return the index.html file.
// * is a wildcard, will return the index.html as indicated by "/"
app.get('*', (request, response) => {
    response.send('<a href="/">Oopsie daisy! Nothing to see here. Navigate back to the homepage?</a>');
});

//GET /notes should return the notes.html file.
app.get('/notes', (request, response) => {
    response.send('<a href="/notes">See notes here.</a>');
});


//The following API routes should be created:

//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (request, response) => {

    //destructure for the items in request.body
    const { title, text } = request.body

    //if all the required properties are present,
    if (title && text) {

        //variable where title value = title property, text value = text property
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        //if we have the required properties, then we can obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => { //file, encoding, callback function
            if (err) {
                console.error(err);
            } else {

                //convert string into JSON object
                const parsedNotes = JSON.parse(data);

                //add a new note to the JSON object
                parsedNotes = push(newNote);

                //return saved notes as JSON
                return JSON.stringify(parsedNotes);

                /*
                //write updated notes back to the file, and stringify the JSON object
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 2), (writeErr) => //(file, data, options, callback) ---- ASK RACHEL AGAIN WHAT THE NULL AND 2 IS?????
                    writeErr ? console.error(writeErr) : console.info('Succesful! Yay!')
                );
                */
            }
        });
}});


//POST REQUEST to add a note
/*POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
*/

app.post('/api/notes', (request, response) => {

    //send a message to the client that request has been received to post a note
    response.status(200).json(`${request.method} request received to post a note.`);

    //log this request to the terminal that the client has requested to post a note
    console.info(`${request.method} request received to post a note.`)

    //destructure for the items in request.body
    const { title, text } = request.body

    //if all the required properties are present,
    if (title && text) {

        //variable where title value = title property, text value = text property
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };


        //if we have the required properties, then we can obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => { //file, encoding, callback function
            if (err) {
                console.error(err);
            } else {

                //convert string into JSON object
                const parsedNotes = JSON.parse(data);

                //add a new note to the JSON object
                parsedNotes = push(newNote);

                //write updated notes back to the file, and stringify the JSON object
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 2), (writeErr) => //(file, data, options, callback) ---- ASK RACHEL AGAIN WHAT THE NULL AND 2 IS?????
                    writeErr ? console.error(writeErr) : console.info('Succesfully posted a note! Yay!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };


        console.log(response);
        response.status(201).json(response);
    } else {
        response.status(500).json('Error in posting note');
    }
});






















    //server listener, the server's job is to listen for requests
    app.listen(PORT, () =>
        console.log(`App listening at http://localhost:${PORT}`)
    );