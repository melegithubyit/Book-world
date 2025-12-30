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
        const user = await User.findById(req.user.userId).select('preferences');
        if (!user) {
            console.log('User not found for recommendations:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const genres = user.preferences?.genres ?? [];
        const authors = user.preferences?.authors ?? [];

        if (!genres.length && !authors.length) {
            return res.status(200).json({
                totalItems: 0,
                books: [],
            });
        }

        const quoteIfNeeded = (value) => {
            const trimmed = String(value ?? '').trim();
            if (!trimmed) return '';
            return /\s/.test(trimmed) ? `"${trimmed}"` : trimmed;
        };

        const normalizeList = (list) => {
            const out = [];
            const seen = new Set();
            for (const item of list ?? []) {
                const trimmed = String(item ?? '').trim();
                if (!trimmed) continue;
                const key = trimmed.toLowerCase();
                if (seen.has(key)) continue;
                seen.add(key);
                out.push(trimmed);
            }
            return out;
        };

        const normalizedGenres = normalizeList(genres);
        const normalizedAuthors = normalizeList(authors);

        const MAX_RESULTS_PER_QUERY = 10;
        const MAX_RECOMMENDATIONS = 15;
        const MAX_PREF_QUERIES_PER_KIND = 8;

        const authorQueries = normalizedAuthors
            .slice(0, MAX_PREF_QUERIES_PER_KIND)
            .map((author) => `inauthor:${quoteIfNeeded(author)}`);

        const genreQueries = normalizedGenres
            .slice(0, MAX_PREF_QUERIES_PER_KIND)
            .map((genre) => `subject:${quoteIfNeeded(genre)}`);

        const queriesToRun = [...authorQueries, ...genreQueries];

        const results = await Promise.allSettled(
            queriesToRun.map((query) => searchBooksFromGoogle({ query, maxResults: MAX_RESULTS_PER_QUERY }))
        );

        const merged = new Map();
        for (const r of results) {
            if (r.status !== 'fulfilled') continue;
            const items = r.value?.items || [];
            for (const item of items) {
                const snapshot = mapGoogleBookToSnapshot(item);
                const id = snapshot?.bookId;
                if (!id) continue;
                if (!merged.has(id)) merged.set(id, snapshot);
                if (merged.size >= MAX_RECOMMENDATIONS) break;
            }
            if (merged.size >= MAX_RECOMMENDATIONS) break;
        }

        const books = Array.from(merged.values()).slice(0, MAX_RECOMMENDATIONS);

        res.status(200).json({
            totalItems: books.length,
            books
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
}


export const getSavedBooks = async (req, res) => {
    const user = await User.findById(req.user.userId).select('savedBooks');
    res.status(200).json(user?.savedBooks ?? []);
}

export const saveBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const user = await User.findById(req.user.userId);
        const alreadySaved = user.savedBooks.some(
            (book) => book.bookId === bookId
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
    const user = await User.findById(req.user.userId).select('finishedBooks');
    const finished = user?.finishedBooks ?? [];

    const books = finished
        .map((entry) => {
            const book = entry.book?.toObject ? entry.book.toObject() : entry.book;
            if (!book) return null;
            return {
                ...book,
                learningNotes: entry.learningNotes ?? '',
            };
        })
        .filter(Boolean);

    res.status(200).json(books);
}


export const markBookAsFinished = async (req, res) => {
    try {
        const { bookId, learningNotes = "" } = req.body;
        const user = await User.findById(req.user.userId);

        const alreadyFinished = user.finishedBooks.some(
            (entry) => entry.book?.bookId === bookId
        );
        if (alreadyFinished) {
            return res.status(400).json({ message: 'Book already marked as finished' });
        }
        const googleBook = await getBookByIdFromGoogle(bookId);
        const bookSnapshot = mapGoogleBookToSnapshot(googleBook);
        user.finishedBooks.push({ book: bookSnapshot, learningNotes });
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

    const user = await User.findById(req.user.userId);
    const entry = user.finishedBooks.find(
        (b) => b.book?.bookId === bookId
    );

    if (!entry) {
        return res.status(404).json({ message: 'Book not found in finished books' });
    }

    entry.learningNotes = learningNotes;
    await user.save();
    res.status(200).json({ message: 'Learning notes updated successfully' });
}


export const removeSavedBook = async (req, res) => {
    try {
        const { bookId } = req.params;  
        const user = await User.findById(req.user.userId);
        user.savedBooks = user.savedBooks.filter(
            (book) => book.bookId !== bookId
        );
        await user.save();
        res.status(200).json({ message: 'Book removed from saved books' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing saved book' });
    }
}


export const removeFinishedBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const user = await User.findById(req.user.userId);
        user.finishedBooks = (user.finishedBooks ?? []).filter(
            (entry) => entry.book?.bookId !== bookId
        );
        await user.save();
        res.status(200).json({ message: 'Book removed from finished books' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing finished book' });
    }
}