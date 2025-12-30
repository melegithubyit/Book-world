import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');

        // Drop problematic indexes if they exist
        try {
            const db = mongoose.connection.db;
            await db.collection('users').dropIndex('finishedBooks.book.bookId_1');
            console.log('Dropped duplicate index on finishedBooks.book.bookId');
        } catch (indexError) {
            // Index might not exist, ignore
            console.log('FinishedBooks index drop skipped (likely already dropped)');
        }

        try {
            const db = mongoose.connection.db;
            await db.collection('users').dropIndex('savedBooks.bookId_1');
            console.log('Dropped duplicate index on savedBooks.bookId');
        } catch (indexError) {
            // Index might not exist, ignore
            console.log('SavedBooks index drop skipped (likely already dropped)');
        }
    }catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};