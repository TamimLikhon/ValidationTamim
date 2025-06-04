import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB successfully");

    }catch(error){
        console.log(error);
    }
}