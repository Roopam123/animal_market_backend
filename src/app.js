import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

const app = express();
dotenv.config();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));
app.use(cookieParser())



// Routes decreation
app.use("/api/v1/users", userRouter);



export { app };