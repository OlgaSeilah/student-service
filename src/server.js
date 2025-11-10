import dotenv from 'dotenv'
import express from 'express'
import studentRoutes from './routes/studentRoutes.js'

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(studentRoutes);
app.use((req, res) => {
    res.status(404).json({message: 'Not found'})
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});