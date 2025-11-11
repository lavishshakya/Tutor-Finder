<<<<<<< HEAD
// filepath: c:\Users\Lavish Shakya\Desktop\Tutor Finder\server\config\db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
=======
import mongoose from "mongoose";
import dotenv from "dotenv";
>>>>>>> 181f83f (Updated Features)

dotenv.config();

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
=======
    const conn = await mongoose.connect(process.env.MONGO_URI);
>>>>>>> 181f83f (Updated Features)

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

<<<<<<< HEAD
export default connectDB;
=======
export default connectDB;
>>>>>>> 181f83f (Updated Features)
