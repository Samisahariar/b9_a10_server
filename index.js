const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.DB_PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_username}:${process.env.DB_pass}@sahariar.8btq1it.mongodb.net/?retryWrites=true&w=majority&appName=Sahariar`;

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
        //await client.connect(); 

        const a_10_DB = client.db("a_10_DB");
        const subcategoryCollection = a_10_DB.collection('data');
        const subcategoryCollection2 = a_10_DB.collection('homepage');

        
        app.get('/homepage', async(req, res) =>{
            const datasforhome = subcategoryCollection2.find();
            const result = await datasforhome.toArray()
            res.send(result)
        })

        app.post('/data', async (req, res) => {
            const newData = req.body;
            const result = await subcategoryCollection.insertOne(newData);
            res.send(result)
        })

        app.get('/alldata', async (req, res) => {
            const cursor = subcategoryCollection.find();
            const alldata = await cursor.toArray();
            res.send(alldata)
        })

        app.get('/:email', async (req, res) => {
            const emails = req.params.email;
            const cursor = subcategoryCollection.find();
            const data = await cursor.toArray()
            const userData = data.filter(singleObject => singleObject.email === emails)
            res.send(userData)
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const singledata = await subcategoryCollection.findOne(query)
            res.send(singledata)
        })

        app.put('/del/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await subcategoryCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/updatepage/:id', async (req, res) => {
            const id = req.params.id;
            const newItemData = req.body;
            console.log(newItemData)
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const coffe = {
                $set: {
                    email:newItemData.email,
                    username:newItemData.username,
                    photo:newItemData.photo,
                    rating:newItemData.rating,
                    itemname:newItemData.itemname,
                    subcategory:newItemData.subcategory,
                    price:newItemData.price,
                    customization:newItemData.customization,
                    processingtime:newItemData.processingtime,
                    stockstatus:newItemData.stockstatus,
                    description:newItemData.description
                },
            };
            const result = await subcategoryCollection.updateOne(filter, coffe, options);
            res.send(result)
        })

        app.get('/craftSection/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const singledata = await subcategoryCollection2.findOne(query)
            res.send(singledata)
        })
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        /* await client.close(); */
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("server is already ready to fireeee!!!!")
})

app.listen(port, () => {
    console.log(`port is runnig on ${port}`)
})