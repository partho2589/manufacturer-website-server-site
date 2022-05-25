const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c1ni4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('computer-hardware').collection('products')
        const reviewCollection = client.db('computer-hardware').collection('reviews')
        app.get('/product', async(req, res)=>{
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        } )
        app.get ('/product/:id' ,async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const product = await productCollection.findOne(query)
            res.send(product)
        })
        
        app.get('/review', async(req, res)=>{
            const query ={}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        app.post('/review', async(req, res)=>{
            const newItem = req.body;
            const result = await reviewCollection.insertOne(newItem)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Client!')
})

app.listen(port, () => {
    console.log(`Manufacturer listening on port ${port}`)
})