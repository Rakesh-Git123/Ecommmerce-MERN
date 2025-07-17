import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongo from "./config/db.js";
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import orderRoutes from "./routes/order.route.js"
dotenv.config();
connectToMongo();

const app=express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running at port number ${process.env.PORT}`);
})