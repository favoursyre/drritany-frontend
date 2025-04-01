///This files connects application to mongodb

//Libraries
import mongoose, { ConnectOptions} from "mongoose";

//console.log("Mongo Server: ", process.env.NEXT_PUBLIC_MONGO_URI)
///This function connects to mongodb
const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI
  
  try {
    const options: ConnectOptions = {
      connectTimeoutMS: 30000,
      dbName: "main"
    }
    if (mongoose.connection.readyState === 1) {
      console.log("DB already connected");
      return;
    }
    if (mongoUri !== undefined) {
      await mongoose.connect(mongoUri, options);
      console.log("Connected to MongoDB.");
    } else {
      throw new Error("Mongo URI not detected")
    }
    
  } catch (error) {
    console.log(error);
    throw new Error("Network error, try again!")
  }
};

export default connectMongoDB;