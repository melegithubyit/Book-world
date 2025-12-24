import {z} from 'zod';

export const preferenceSchema = z.object({
    genres: z.array(z.string()).min(1, 'At least one genre must be selected'),
    authors: z.array(z.string()).min(1, 'At least one author must be selected'),
})