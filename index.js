const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")
require("dotenv").config()

app.use(cors());
app.use(express.json());

// MONGO DB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.ofi7kql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

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
    await client.connect();

    const touristSpotsCollection = client.db("touristSpotsDB").collection("touristSpots");

    // get all tourist spots
    app.get("/touristSpots", async(req, res) => {
        const cursor = touristSpotsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // create user
    app.post("/touristSpots", async(req, res) => {
        const newTouristSpot = req.body;
        console.log(newTouristSpot);
        const result = await touristSpotsCollection.insertOne(newTouristSpot);
        res.send(result);
    })

    // get by email
    app.get("/touristSpots/:email", async(req, res) => {
        const result = await touristSpotsCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })

    // delete from my list
    app.delete("/touristSpots/:id", async(req, res) => {
        const result = await touristSpotsCollection.deleteOne({_id: new ObjectId(req.params.id)})
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello tourism server.')
  })
  
  app.listen(port, () => {
    console.log(`server running on ${port}`)
  })