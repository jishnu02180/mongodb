const express = require('express');
const bodyParser = require('body-parser');
const password = '6epMZd559a7r4P7';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://organic:6epMZd559a7r4P7@cluster0.ayo4r.mongodb.net/organicdb?retryWrites=true&w=majority";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) => {
      collection.find({})
      .toArray((err,documents) =>{
          res.send(documents);
      })
  })

  app.post('/addProduct',(req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
        console.log('One product added');
        //res.send('Success');
        res.redirect('/');
    })
  });

  app.patch('/update/:id', (req, res) => {
      collection.updateOne({_id: ObjectId(req.params.id)},
      {
          $set:{price: req.body.price, quantity: req.body.quantity}
      })
      .then(result =>{
          res.send(result.modifiedCount > 0);
      })
  })

  app.delete('/delete/:id', (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then((results) => {
         res.send(results.deletedCount > 0);
      })
  })

  app.get('/product/:id', (req, res) => {
      collection.find({_id: ObjectId(req.params.id)})
      .toArray((err,documents) =>{
          res.send(documents[0]);
      })
  })
  
  console.log('Database connected');
  //client.close();
});


app.listen(3000);