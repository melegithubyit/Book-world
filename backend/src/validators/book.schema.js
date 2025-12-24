import { z } from 'zod';

export const saveBookSchema = z.object({
    bookId: z.string().min(1, 'Book ID is required'),
});

export const updateLearningNotesSchema = z.object({
    learningNotes: z.string().min(1, 'Learning notes cannot be empty'),
});

export const fininshBookSchema = z.object({
    bookId: z.string().min(1, 'Book ID is required'),
    learningNotes: z.string().optional(),
});