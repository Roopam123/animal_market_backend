import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbResponse = await mongoose.connect(process.env.DB_URI);
        console.log("Database connected successfully !!🥳 Host:", dbResponse.connection.host);
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
};
export { connectDB };
