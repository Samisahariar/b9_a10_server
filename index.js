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
        await client.connect();

        const a_10_DB = client.db("a_10_DB");
        const subcategoryCollection = a_10_DB.collection('data');

        app.post('/data', async (req, res) => {
            const newData = req.body;
            const result = await subcategoryCollection.insertOne(newData);
            res.send(result)
        })

        app.get('/:email', async(req, res) =>{
            const emails = req.params.email
            const query = { email : emails}; 
            const cursor =  subcategoryCollection.find(); 
            const data = await cursor.toArray()
            const userData = data.filter(singleObject => singleObject.email === emails)
            res.send(userData)
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