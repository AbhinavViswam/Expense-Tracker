import mongoose from "mongoose";

const connectDb = async () => {
  const db = process.env.DB;
  try {
    if (db) {
      await mongoose.connect(db);
      console.log("DB ready");
    }
  } catch {
    throw new Error("cannot connect to db");
  }
};

export default connectDb;
