import { searchBooksFromGoogle, getBookByIdFromGoogle } from "../services/googleBooks.service.js"; 
import { mapGoogleBookToSnapshot } from "../mappers/googleBook.mapper.js";
import User from "../models/User.js";

export const searchBooks = async (req, res) => {
    try {
        const { q, startIndex = 0, maxResults = 10, orderBy, printType } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Query parameter 'q' is required" });
        }
        const data = await searchBooksFromGoogle({
            query: q,
            startIndex: Number(startIndex) || 0,
            maxResults: Number(maxResults) || 10,
            orderBy,
            printType,
        });
        const books = (data.items || []).map(mapGoogleBookToSnapshot);
        res.status(200).json({
            totalItems: data.totalItems,
            books
        });
    }catch(error){
        res.status(500).json({ message: 'Error searching books' });
    }
}


export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getBookByIdFromGoogle(id);
        const book = mapGoogleBookToSnapshot(data);
        res.status(200).json(book);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
}


export const getRecommendations = async (req, res) => {
    try {
        const { genres = [], authors = [] } = req.userPreferences || {};
        let query = "books";

        if (genres.length) {
            query += ` subject:${genres[0]}`;
        }

        if (authors.length) {
            query += `+inauthor:${authors[0]}`;
        }

        const data = await searchBooksFromGoogle({ query });
        const books = (data.items || []).map(mapGoogleBookToSnapshot);

        res.status(200).json({
            totalItems: data.totalItems,
            books
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
}


export const getSavedBooks = async (req, res) => {
    const user = await User.findById(req.user.userId).populate('savedBooks');
    res.status(200).json(user.savedBooks);
}

export const saveBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const user = await User.findById(req.user.userId);
        const alreadySaved = user.savedBooks.some(
            (book) => book.googleBookId === bookId
        )

        if (alreadySaved) {
            return res.status(400).json({ message: 'Book already saved' });
        }

        const googleBook = await getBookByIdFromGoogle(bookId);
        const bookSnapshot = mapGoogleBookToSnapshot(googleBook);
        user.savedBooks.push(bookSnapshot);
        await user.save();
        res.status(200).json({ message: 'Book saved successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving book' });
    }
}


export const getFinishedBooks = async (req, res) => {
    const user = await User.findById(req.user.userId).populate('finishedBooks');
    res.status(200).json(user.finishedBooks);
}


export const markBookAsFinished = async (req, res) => {
    try {
        const { bookId, learningNotes = "" } = req.body;
        const user = await User.findById(req.user.userId);

        const alreadyFinished = user.finishedBooks.find(
            (book) => book.googleBookId === bookId
        )
        if (alreadyFinished) {
            return res.status(400).json({ message: 'Book already marked as finished' });
        }
        const googleBook = await getBookByIdFromGoogle(bookId);
        const bookSnapshot = mapGoogleBookToSnapshot(googleBook);
        user.finishedBooks.push(bookSnapshot);
        await user.save();
        res.status(200).json({ message: 'Book marked as finished successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking book as finished' });
    }
}

export const updateLearningNotes = async (req, res) => {
    const { learningNotes } = req.body;
    const { bookId } = req.params;

    const User = await User.findById(req.user.userId);
    const book = User.finishedBooks.find(
        (b) => b.googleBookId === bookId
    );

    if (!book) {
        return res.status(404).json({ message: 'Book not found in finished books' });
    }

    book.learningNotes = learningNotes;
    await User.save();
    res.status(200).json({ message: 'Learning notes updated successfully' });
}


export const removeSavedBook = async (req, res) => {
    try {
        const { bookId } = req.params;  
        const user = await User.findById(req.user.userId);
        user.savedBooks = user.savedBooks.filter(
            (book) => book.googleBookId !== bookId
        );
        await user.save();
        res.status(200).json({ message: 'Book removed from saved books' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing saved book' });
    }
}