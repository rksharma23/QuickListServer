import { DB_NAME } from "../constants.js"
import mongoose from "mongoose"


const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected successfully");
        console.log(connection.connection.host);        
    } catch (error) {
        console.log("MongoDB refused to connect", error)
        throw(error);
    }
}

export default connectDB