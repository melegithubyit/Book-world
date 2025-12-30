import mongoose from "mongoose";

const imageLinksSchema = new mongoose.Schema(
    {
    smallThumbnail: String,
    thumbnail: String,
    small: String,
    medium: String,
    large: String,
    extraLarge: String,
    },
    { _id: false }
);


const bookSnapshotSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtite : { type: String, default: '' },
    authors: {
        type: [String],
        default: ['Unknown Author'],
    },
    bookId: { type: String, required: true, unique: false },
    publishedDate: { type: String, default: 'Unknown' },
    description: {
        type: String,
        default: 'No description available.',
    },
    categories: {
        type: [String],
        default: ['Uncategorized'],
    },
    averageRating: { type: Number, min: 0, max: 5 },
    language: { type: String, default: 'en' },
    previewLink: { type: String, default: null },
    imageLinks: imageLinksSchema
},
{ _id: false }
);

export default bookSnapshotSchema;