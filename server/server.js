import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { dbConnect } from "./dbConnect/dbConnect.js";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// Debugging fallback for missing routes - moved before app.listen
app.use((req, res) => {
    res.status(404).send("Route not found");
});

app.listen(5001, () => {
    console.log("Server is running on port 5001.");
    dbConnect();
});