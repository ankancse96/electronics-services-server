const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s7lrl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello Bbau!')
  })

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("ServicesCpllection").collection("services");
  const bookingCollection = client.db("ServicesCpllection").collection("addOrder");
  const ratingCollection = client.db("ServicesCpllection").collection("addRating");
  const engineerCollection = client.db("ServicesCpllection").collection("engineers");

  app.get('/services',(req,res)=>{
  
  
    serviceCollection.find()
    .toArray((err,documents) =>{
        console.log('from database',documents)
      res.send(documents);
      })
   
    
  })

  app.get('/ratings',(req,res)=>{
  
  
    ratingCollection.find()
    .toArray((err,documents) =>{
        console.log('from database',documents)
      res.send(documents);
      })
   
    
  })

  app.get('/services/:name',(req,res)=>{
    serviceCollection.find({name: req.params.name})
    .toArray((err,documents) =>{
      res.send(documents[0]);
      })
  })


  app.get('/orders',(req,res)=>{
  
  
    bookingCollection.find({email:req.query.email})
    .toArray((err,documents) =>{
        console.log('from database',documents)
      res.send(documents);
      })
   
    
  })

  app.get('/totalOrders',(req,res)=>{
  
  
    bookingCollection.find({})
    .toArray((err,documents) =>{
        console.log('from database',documents)
      res.send(documents);
      })
   
    
  })

  app.get('/engineers', (req, res) => {
    engineerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});


  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    bookingCollection.insertOne(newOrder)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    
})

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new event: ',  newService)
    serviceCollection.insertOne(newService)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.post('/addEngineer', (req, res) => {
  const newEngineer = req.body;
  engineerCollection.insertOne(newEngineer)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  
})

app.post('/addrating', (req, res) => {
  const newRating = req.body;
  console.log('adding new event: ',  newRating)
  ratingCollection.insertOne(newRating)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })

})
  app.delete("/delete/:id",(req,res)=>{
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount>0);
    
  })
})
app.post('/isEngineer', (req, res) => {
  const email = req.body.email;
  engineerCollection.find({ email: email })
      .toArray((err, doctors) => {
          res.send(doctors.length > 0);
      })
})
  console.log('database connected')
});
  app.listen(port)

