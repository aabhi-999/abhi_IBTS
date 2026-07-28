import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import busroutes from "./routes/busroutes.js";

dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("IBTS Backend Running");
});

app.use("/api", busroutes);
app.get("/test", (req,res)=>{
  res.send("Backend working");
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
