import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Listen for the connected event
        mongoose.connection.on('connected', () => {
            console.log("DB CONNECTED");
        });

        // Listen for errors during the connection
        mongoose.connection.on('error', (err) => {
            console.error(`DB connection error: ${err.message}`);
        });

        // Connect to the database
        await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`);

    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
