const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vaopm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("Qutir-Shop").collection("products");
        const ordersCollection = client.db("Qutir-Shop").collection("orders");
        console.log('database is connected successfully');

        //products api
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        })
        //My Order Post method
        app.post('/addOrder', (req, res) => {
            // console.log(req.body);
            ordersCollection.insertOne(req.body).then(result => {
                console.log(result);
                res.send(result.insertedId);
            })
        });
        //get my orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })
        //delete Orders
        app.delete('/deleteOrder/:id', async (req, res) => {
            // console.log(req.params.id);
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            // console.log(result);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Qutir Mahal Server is running');
})

app.listen(port, () => {
    console.log('listening from the port', port);
})