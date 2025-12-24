// this file is the endtry point for the backend server
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI is not set; starting server without DB connection.');
    } else {
        await connectDB();
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();