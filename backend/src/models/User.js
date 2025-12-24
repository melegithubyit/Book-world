import mongoose from "mongoose";
import bookSnapshotSchema from "./bookSnapshot.schema.js";

const finishedBookSchema = new mongoose.Schema(
    {
        book: bookSnapshotSchema,
        learningNotes: {
            type: String,
            default: '',
        },
        finishedAt: { type: Date, default: Date.now },
    },
    { _id: false }
)

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        default: null,
        select: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: {
        type: String,
        default: null
    },
    preferences: {
        genres: {type: [String], default: []},
        authors: {type: [String], default: []},
    },

    savedBooks: { type: [bookSnapshotSchema], default: [] },

    finishedBooks: { type: [finishedBookSchema], default: [] },

}, { timestamps: true }
);

/**
 * Exports the default User model created from the userSchema using Mongoose.
 * This line defines a Mongoose model named 'User' based on the provided schema,
 * allowing for database operations like creating, reading, updating, and deleting user documents.
 * The model is exported as the default export of this module.
 */
export default mongoose.model('User', userSchema);