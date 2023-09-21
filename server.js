//require express
const express = require('express');
const path = require('path');
const fs = require('fs');

// Helper method for generate unique ids --to put in body of get/post requests functions!!!!!!
const uuid = require();

//boilerplate middleware
const PORT = 3001;
const app = express(); //create instance of express

app.use(express.json()); //when we make requests, we can use json format AND
app.use(express.urlencoded({ extended: true })); //when we make requests, we can use urlencoded format


































//server listener, the server's job is to listen for requests
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);