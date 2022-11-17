const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default Root
app.get('/', (req, res) =>{
    res.send('Server is Running');
});

// All services
app.get('/services', (req, res) =>{

})

app.listen(port, () =>{
    console.log('Server is running on port: ', port);
});