const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/dbConnect");
const app = express();
const cors = require("cors");

const workspace = require("./Routes/workspace.route");
const categoryRouter = require("./Routes/category.route");
const snippet = require("./Routes/snippet.route");
const Share = require("./Routes/share.route");
const user = require("./Routes/user.route");

dotenv.config();

import { Request,Response } from "express";



db();

const PORT = process.env.PORT || 4000;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",                 // for local dev
  "https://snipix.vercel.app/"     // replace with your Vercel frontend URL
];

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  credentials: boolean;
  methods: string[];
  allowedHeaders: string[];
}

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ): void {
      // allow requests with no origin like Postman or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  } as CorsOptions)
);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use("/v1/api/workspace", workspace);
app.use("/v1/api/category", categoryRouter);
app.use("/v1/api/snippet", snippet);
app.use("/v1/api/share", Share);
app.use("/v1/api/user", user);

app.get("/serverUp", async(req:Request,res:Response)=>{
  try {
    res.status(200).json({msg:"Server is awake!"})
  } catch (error:any) {
    res.status(500).json({error})
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on http://0.0.0.0:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`App is running on ${PORT}`);
// });