import dotenv from 'dotenv'
import express from 'express'
import studentRoutes from './routes/studentRoutes.js'
import mongoose from "mongoose";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).json({message: 'Not found'})
})

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {dbName: process.env.DB_NAME});

        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        });
    } catch (error) {
        console.log(`Failed connecting to MongoDB: ${error.message}`);
    }
}

startServer();