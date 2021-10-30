const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
    const bookingCollection = database.collection('bookings');

    // Get packages API
    app.get('/packages', async (req, res) => {
        const cursor = packageCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    });

    // get single package API
    app.get('/package/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const package = await packageCollection.findOne(query);
        res.send(package);
    });

    // Booking Post API
    app.post('/bookings', async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.json(result);
    });

    // Packages Post API
    app.post('/packages', async (req, res) => {
        const package = req.body;
        const result = await packageCollection.insertOne(package);
        res.json(result);
    });

    // get single user booked items
    app.post('/my-booked', async (req, res) => {
        const email = req.body;
        const query = { email: { $in: email } }
        // console.log(query);
        const cursor = bookingCollection.find(query);
        const myBooked = await cursor.toArray()
        res.send(myBooked)
    });

    //Update user
    app.put('/my-booked/:id', async (req, res) => {
        const id = req.params.id;
        const approvedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
            $set: {
                status: approvedUser.status = true
            }
        };
        const result = await bookingCollection.updateOne(filter, updateDoc);
        res.json(result);
    });

    // Get All booked API
    app.get('/all-booked', async (req, res) => {
        const cursor = bookingCollection.find({});
        const allBooked = await cursor.toArray();
        res.send(allBooked);
    });

    // Booked Delete API
    app.delete('/all-booked/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await bookingCollection.deleteOne(query);
        res.send(result)
    })


};



run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from Travelzen Server');
});

app.listen(port, () => {
    console.log('Running port is: ', port);
})