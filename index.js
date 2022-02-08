import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 8090

mongoose.connect(process.env.DATABASE_URL)
    .then(() => app.listen(PORT, () => console.log(`listening port ${PORT}`)))
    .catch(err => console.log(err.message));