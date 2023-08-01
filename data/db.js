import mongoose from "mongoose";

export const connectToMongo = async () => {
  try {
    const c = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "chatapp",
    });
    console.log(`Database Connected with ${c.connection.host}`);
  } catch (error) {
    console.log(error.message);
    console.log("Failed To Connect To Database");
  }
};
