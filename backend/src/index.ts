import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/db";

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`<div>aur bhaicd  ho</div>`);
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
