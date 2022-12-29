const express = require ('express');
const app =express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { query } = require('express');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// midle ware 
app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        "Access-Control-Allow-Origin":"http://localhost:3000"
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.xa1zyf9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const postCollections = client.db("posts").collection("allPost");
const postcomment = client.db("posts").collection("comments");

// user store data
app.post('/userPosts', async(req, res)=>{
    try{
    const data = req.body;
    console.log(data);
    const result = await postCollections.insertOne(data);
    res.send(result);
    }
    catch(e){
        console.log(e.message);
    }
})
// user post get api
app.get('/userPosts', async(req, res)=>{
    const query = {};
    const result = await postCollections.find(query).toArray();
    res.send(result);
})

// comment post
app.post('/comments', async(req, res)=>{
    try{
    const data = req.body;
    // console.log(data);
    const result = await postcomment.insertOne(data);
    res.send(result);
    }
    catch(e){
        console.log(e.message); 
    }
})
// comment get api
app.get('/comments', async(req, res)=>{ 
    const query = {};
    const sortingComment =  postcomment.find(query).sort({
        commentTime: -1
    });
    const result = await sortingComment.toArray(); 
    res.send(result); 
})
//  comments delete api
app.delete('/comments/:id', async(req, res)=>{
    const id = req.params.id;
    // console.log(id);
    const query = {_id: ObjectId(id)};
    const result = await postcomment.deleteOne(query);
    res.send(result);
})
app.get('/', (req, res)=>{
    res.send('server is running');
})

app.listen(port, ()=>{
    console.log(`server running ${port} port`)
}) 