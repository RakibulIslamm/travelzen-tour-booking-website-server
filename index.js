const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvyuz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async () => {
    await client.connect();
    console.log('DB connected');
    const database = client.db('Travelzen');
    const packageCollection = database.collection('packages');

    // Get packages API
    app.get('/packages', async (req, res) => {
        const cursor = packageCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    })

};

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from Travelzen Server');
});

app.listen(port, () => {
    console.log('Running port is: ', port);
})