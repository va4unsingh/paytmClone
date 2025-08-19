import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/db";
import userRouter from "./routes/index";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.json({ message: "Test works!" });
});

connectDB();

app.use("/api/v1", userRouter);

app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
