const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

let MongoClient = require('mongodb').MongoClient
let url = 'mongodb://127.0.0.1:27017/event';

const eventRoutes = require("./routes/event");
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname , 'uploads')));

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next();
});

app.use("/api/v3/app",eventRoutes);

MongoClient.connect(url, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err, client)=>{
        if(err) throw err;
        console.log("mongodb connected locally");
        db = client.db()
        app.listen(4000,()=>{console.log("connected to localhost:4000")});
});