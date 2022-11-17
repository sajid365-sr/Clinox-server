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

const services = require('./services.json');

// MongoDB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.90qadcl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{
    try{
        const serviceCollection = client.db("Clinox").collection('Services');



    }
    catch{

    }

}

run().catch(console.dir);



// Default Root
app.get('/', (req, res) =>{
    res.send('Server is Running');
});

// All services
app.get('/services', (req, res) =>{
    res.send(services)
    
})

// JW Token
app.get('/jwt', (req,res) =>{
    res.send(JSON.stringify(process.env.JW_TOKEN));
})

app.listen(port, () =>{
    console.log('Server is running on port: ', port);
});