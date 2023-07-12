const express = require('express')
require('dotenv').config()
const { MongoClient } = require("mongodb");

const app = express()
const port = process.env.PORT || 3000
app.use(express.json());


let db;
async function connect() {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27027"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to the database');
        db = client.db(process.env.MONGO_DATABASE_NAME || "test");
    } catch (err) {
        console.error('Error connecting to the database', err);
        process.exit(1);
    }
}

connect();

app.get('/', async (req, res) => {
    const date = req.query.date || new Date().toISOString().substring(0, 10);
    console.log(`Request for date ${date}`)
    const collection = db.collection('rateOfExchange');

    // Query mongo by using aggregate pipeline
    const pipeline = [
        { $match: { quotationDatetime: new Date(date),  unitCurrency: 'USD' } },
        { $project: {_id: 0, quotationCurrency: 1, exchangeRate: 1}}
    ];
    
    const r = await collection.aggregate(pipeline).toArray();
    
    // Query mongo by using mongo method
    
    // const r = await collection.find({
    //     quotationDatetime: new Date(date),
    //     unitCurrency: 'USD'
    // }).toArray();

    res.json(r)
})

app.listen(port, () => {
  console.log(`mongodb api running on port ${port}`)
})