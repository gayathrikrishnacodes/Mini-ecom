
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
    res.send("E-Commerce API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || "Server error"
    });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB error:", error.message);
    });
