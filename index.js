const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.90qadcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{
    try{
        const serviceCollection = client.db("Clinox").collection('Services');

        // All services
    app.get('/services', async(req, res) =>{
        const query = {};
        const cursor = serviceCollection.find(query);
        const result = await cursor.toArray();

        res.send(result);
    
    })

    }
    catch{

    }

}

run().catch(console.dir);



// Default Root
app.get('/', (req, res) =>{
    res.send('Server is Running');
});



// JW Token
app.get('/jwt', (req,res) =>{
    res.send(JSON.stringify(process.env.JW_TOKEN));
})

// Listen Port
app.listen(port, () =>{
    console.log('Server is running on port: ', port);
});