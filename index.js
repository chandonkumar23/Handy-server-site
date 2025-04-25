const express = require('express');
const cors = require('cors');

require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
 app.use(cors({origin:["https://colly-df2ef.web.app","http://localhost:5173"]}));
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
    // await client.connect();

    // const servicesCollection = client.db('homeServices').collection('HomeServices');
    const bookingCollection = client.db('homeServices').collection('Bookings')
    const addCollection = client.db('homeServices').collection('AddService')

    app.get('/AddServices', async(req,res)=>{
        const cursor = addCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // single ddala
    app.get('/AddServices/:id',async(req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addCollection.findOne(query);
      res.send(result);
    })

    // Add new service
    app.post('/AddServices',async(req,res)=>{
      const add = req.body;
      const result = await addCollection.insertOne(add)
      res.send(result);
    })


    // app.get('/AddServices',async(req,res)=>{
    //   console.log(req.query.userEmail);
    //   let query = {}
    //   if (req.query?.usermail){
    //     query = {usermail: req.query.usermail}
    //   }
    //   const result = await addCollection.find(query).toArray();
    //   res.send(result)
    // })



    // manage services

    // app.get('/AddServices', async (req,res) =>{
    //   const {email}=req.query
    //   let query = {}
    //   if (req.query?.usermail){
    //     query = {email: req.query.usermail}
    //   }

    //   const result = await addCollection.find(query).toArray();
    //   res.send(result)
    // })

    app.get("/AddServices", async (req, res) => {
      const {usermail} = req.query;
      // console.log("token:", req.cookies.token);
      console.log(usermail)
      // if (req.query.usermail !== req.user.usermail) {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      let query = {};
      if (req.query?.usermail) {
        query = { usermail: req.query.usermail };
      }
      console.log(query);
      const cursor = addCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })













    // update
    app.put('/AddServices/:id',async(req ,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedSerices = req.body;
      const serices = {
        $set: {
          name: updatedSerices.name,
          userEmail: updatedSerices.userEmail,
          userName: updatedSerices.userName,
          price: updatedSerices.price,
          image: updatedSerices.image,
          area: updatedSerices.area,
          description: updatedSerices.description
        }
      }
      const result = await addCollection.updateOne(filter,serices,options)
      res.send(result);
    })

    // delete

    app.delete('/AddServices/:id',async (req,res)=>{
      const id =req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await addCollection.deleteOne(query);
      res.send(result);
    })




    // Bookings 
    app.post('/bookings', async (req,res)=>{
      const bookings = req.body;
      console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });
  
    // Bokking data find  user based
    app.get('/bookings', async (req,res) =>{
      console.log(req.query.userEmail);
      let query = {}
      if (req.query?.usermail){
        query = {usermail: req.query.usermail}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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