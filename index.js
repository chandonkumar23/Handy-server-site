const express = require('express');
const cors = require('cors');

require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
 app.use(cors());
 app.use(express.json());

console.log(process.env.DB_PASS)
 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6tweslj.mongodb.net/?retryWrites=true&w=majority`;

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

    const servicesCollection = client.db('homeServices').collection('HomeServices');
    const bookingCollection = client.db('homeServices').collection('Bookings')
    app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // single ddala
    app.get('/services/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(query);
      res.send(result);
    })


    // Bookings API
    app.post('/bookings', async (req,res)=>{
      const bookings = req.body;
      console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });
  
    // Bokking data find for user based
    app.get('/bookings', async (req,res) =>{
      console.log(req.query.userEmail);
      let query = {}
      if (req.query?.userEmail){
        query = {userEmail: req.query.userEmail}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
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






 

 app.get('/',(req,res)=>{
    res.send('server is running')

 })
 app.listen(port,()=>{
    console.log(`the home changer server is running on ${port} `)
 })