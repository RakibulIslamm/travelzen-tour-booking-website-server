const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






app.get('/', (req, res) => {
    res.send('Hello from Travelzen Server');
});

app.listen(port, () => {
    console.log('Running port is: ', port);
})