import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not set");
        }

        // Use the URI exactly as provided (it may already include the DB name and options)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;

// import mongoose from "mongoose";
// import dns from "node:dns";

// // This line is crucial for Node.js 18+ on Windows to prevent DNS resolution issues
// dns.setDefaultResultOrder('ipv4first');

// const connectDB = async () => {
//     try {
//         // We use the URI directly. Ensure /QuickBasket is included in the string or pass it here
//         await mongoose.connect(process.env.MONGODB_URI, {
//             serverSelectionTimeoutMS: 5000, // Fail faster so you don't wait 30s
//             connectTimeoutMS: 10000,
//         });
//         console.log("🚀 MongoDB connected to QuickBasket");
//     } catch (error) {
//         console.error("❌ MongoDB connection error:", error.message);
//         process.exit(1);
//     }
// };

// export default connectDB;