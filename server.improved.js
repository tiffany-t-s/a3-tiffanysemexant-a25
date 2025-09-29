const express = require ('express')
const mongodb = require ('mongodb')
const mongoose = require ('mongoose')
const dotenv = require('dotenv').config({ path: ".env" })
const app = express()
let appdata = []
const port = 3000

//instead of get requests, look in this folder to find the files
app.use( express.static('public'));
app.use( express.json() );
app.use(express.urlencoded({ extended: true }));

//connecting to MongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERNM}:oLPnjEVPtC6ezvSS@cluster0.sgzukri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect(
      err => {
		    console.log("err :", err);
		    client.close();
	  });  
    collection = client.db("movieRaterDB").collection("userData");
    // Send a ping to confirm a successful connection
    await client.db("movieRaterDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //call to other functions here
  }
   finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const middleware_creds = async (req, res, next) => {
  appdata.length = 0;
  const userInfo = req.body
  await client.connect(
      err => {
		    console.log("err :", err);
        console.log("closing client :(")
		    client.close();
	}); 
  //we need to get the user with the same username nad password
  const newCollection = await client.db("movieRaterDB").collection("userData");
  username = userInfo.username;
  password = userInfo.password;
  let query = {$and : [{username: userInfo.username, password: userInfo.password}]}
  const result = await newCollection.findOne(query);
  
  if (!result){
    //if the user doesnt exist, we need to add the username and password to the database
    let newDoc = req.body;
    newDoc["reviews"] = [];
    await newCollection.insertOne(newDoc)
    req.json = JSON.stringify(newDoc.reviews)
    next()
  }
  else{
    const reviews = result.reviews
    req.json = JSON.stringify(reviews)
    reviews.forEach(review => {
      appdata.push(review)
    })
    next()
  }
}

app.post('/getUserData', middleware_creds, (req, res) => {
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end(req.json)
  client.close();
})

//this gets the data from 
const middleware_post = async (req, res, next) => {
  //open up the client
  await client.connect(
      err => {
		    console.log("err :", err);
        console.log("closing client :(")
		    client.close();
	  }); 
  let parsedString = req.body
  let currentRank = 1;
  //go through appdata, check to see if the new entry already exists, and at the same time, update rankings
  appdata.forEach(entry =>{
    if ((entry.movieName == parsedString.movieName) && (entry.releaseYear == parsedString.releaseYear)){
      let index = appdata.indexOf(entry)
      appdata.splice(index, 1)
    }
  })
  appdata.forEach(entry =>{
    //rank the new entry based on its stars
    if (+parsedString.numStars >= +entry.numStars){
      entry.ranking++;
    }
    else{
      currentRank++;
    }
  })
  parsedString.ranking = currentRank;
  appdata.push(parsedString);
  //need to update the database with the new information
  const newCollection = await client.db("movieRaterDB").collection("userData");
  let query = {$and : [{username: username, password: password}]}
  await newCollection.deleteOne(query)
  let doc = {username : username, password: password, reviews : appdata}
  await newCollection.insertOne(doc)
  req.json = JSON.stringify(appdata);
  client.close();
  next()
}

app.post( '/submit',  middleware_post, (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( req.json )
});

const middleware_delete = async (req, res, next) =>{
  await client.connect(
      err => {
		    console.log("err :", err);
        console.log("closing client :(")
		    client.close();
	  }); 
  let parsedString = req.body;
  let removedRank = 0;
  appdata.forEach(entry =>{
    //if we found match, remove it from appdata
    if ((entry.movieName == parsedString.movieName) && (entry.releaseYear == parsedString.releaseYear)){
        removedRank = entry.ranking
        let index = appdata.indexOf(entry)
        appdata.splice(index, 1)
    }
  })
  //update the rankings. since we're only removing one thing at a time, any entry below that ranking will be bumped
  appdata.forEach(entry =>{
    if (entry.ranking > removedRank){
      entry.ranking--;
    }
  })
  req.json = JSON.stringify(appdata)
  const newCollection = await client.db("movieRaterDB").collection("userData");
  let query = {$and : [{username: username, password: password}]}
  await newCollection.deleteOne(query)
  let doc = {username : username, password: password, reviews : appdata}
  await newCollection.insertOne(doc)
  client.close();
  next()
}

app.post( '/delete',  middleware_delete, (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( req.json )
});


app.get( '/showMe', (req, res) =>{
  res.writeHead( 200, { "Content-Type": 'application/json' })
  res.end( JSON.stringify(appdata) )
})

const listener = app.listen( process.env.PORT || port )