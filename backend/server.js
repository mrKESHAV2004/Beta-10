import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongoDb.js';
import { addProduct, listProducts, removeProduct, singleProduct } from './controllers/productController.js';
import adminAuth from './middleware/adminAuth.js';
import upload from './middleware/multer.js';
import userRouter from './routes/userRoutes.js';


const app  = express();
const port  = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter);

app.use('/api/product/list', listProducts);
app.use('/api/product/single',singleProduct);
app.use('/api/product/remove',adminAuth,removeProduct);
app.use('/api/product/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);;

app.get('/',(req,res)=>{
    res.send("api working")
})
app.listen(port,()=>console.log('server has started:'+port))