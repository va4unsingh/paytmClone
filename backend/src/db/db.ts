import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let DBURI = process.env.MONGODB_URI;
    if (!DBURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const db = await mongoose.connect(DBURI);
    console.log(`MONGO DB CONNECTED TO HOST: ${db.connection.port}`);
  } catch (error) {
    console.error("MongoDB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
