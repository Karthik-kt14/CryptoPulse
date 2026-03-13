// const mongoose = require("mongoose")
// const dotenv = require("dotenv").config()

// const connectDb=async()=>{
//     await mongoose.connect(process.env.CONNECTION_STRING)
//     .then(()=>console.log("connected......"));
// }

// module.exports=connectDb;

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();
// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDb = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected...");
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// };


// export default connectDb;
// // module.exports = connectDb;


const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected...");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDb;