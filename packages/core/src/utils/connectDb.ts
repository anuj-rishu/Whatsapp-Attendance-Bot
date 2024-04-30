import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI!)
        console.log('MongoDB connection: ', connection.connection.host);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB