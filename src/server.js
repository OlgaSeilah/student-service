import dotenv from 'dotenv'
import express from 'express'
import studentRoutes from './routes/studentRoutes.js'
import {MongoClient} from "mongodb";
import {initDb} from "./repository/studentRepository.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).json({message: 'Not found'})
})

async function startServer() {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        initDb(database);

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        });
    } catch (error) {
        console.log(`Failed connecting to MongoDB: ${error.message}`);
    }
}

startServer();