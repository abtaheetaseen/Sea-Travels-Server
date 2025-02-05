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
    const countryCollection = client.db("touristSpotsDB").collection("country")

    // get all tourist spots
    app.get("/touristSpots", async(req, res) => {
        const cursor = touristSpotsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // get add country
    app.get("/country", async(req, res) => {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // create spot
    app.post("/touristSpots", async(req, res) => {
        const newTouristSpot = req.body;
        console.log(newTouristSpot);
        const result = await touristSpotsCollection.insertOne(newTouristSpot);
        res.send(result);
    })

    // create country
    app.post("/country", async(req, res) => {
        const newCountry = req.body;
        console.log(newCountry);
        const result = await countryCollection.insertOne(newCountry);
        res.send(result);
    })

    // update spot
    app.put("/touristSpots/:id", async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedTouristSpot = req.body;
        const touristSpot = {
            $set: {
                photoURL: updatedTouristSpot.photoURL,
                countryName: updatedTouristSpot.countryName,
                touristSpotName: updatedTouristSpot.touristSpotName,
                location: updatedTouristSpot.location,
                description: updatedTouristSpot.description,
                averageCost:updatedTouristSpot.averageCost,
                seasonality: updatedTouristSpot.seasonality,
                travelTimeDays:updatedTouristSpot.travelTimeDays,
                totalVisitorsPerYear: updatedTouristSpot.totalVisitorsPerYear
            }
        }

        const result = await touristSpotsCollection.updateOne(filter, touristSpot, options);
        res.send(result);
    })

    // get by email
    app.get("/touristSpots/:email", async(req, res) => {
        const result = await touristSpotsCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })

    // get by country name
    app.get("/country/:countryName", async(req, res) => {
        const result = await touristSpotsCollection.find({countryName: req.params.countryName}).toArray()
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