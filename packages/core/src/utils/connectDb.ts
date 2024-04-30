import mongoose from "mongoose";
import { Config } from "sst/node/config";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(Config.MONGODB_URI!)
        console.log('MongoDB connection: ', connection.connection.host);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB