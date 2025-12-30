import axios from 'axios';

const BASE_URL = process.env.GOOGLE_BOOKS_API_URL || 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export const searchBooksFromGoogle = async ({
    query,
    startIndex = 0,
    maxResults = 15,
    orderBy = 'relevance',
    printType = 'books',
}) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: query,
                startIndex,
                maxResults,
                orderBy,
                printType,
                key: API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching books from Google Books API');
    }
}

export const getBookByIdFromGoogle = async (bookId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${bookId}`, {
            params: {
                key: API_KEY,
            },
        });
        return response.data;

    }catch(error){
        throw new Error('Error fetching book details from Google Books API');
    }
}