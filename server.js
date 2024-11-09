import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongoDb.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoutes.js';

const app  = express();
const port  = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter);
app.use('/api/product',productRouter);

app.get('/',(req,res)=>{
    res.send("api working")
})
app.listen(port,()=>console.log('server has started:'+port))