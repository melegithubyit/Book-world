import { Router } from "express";
import { searchBooks, getBookById, getRecommendations, getSavedBooks, saveBook, markBookAsFinished, getFinishedBooks, removeSavedBook, updateLearningNotes } from "../controllers/book.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { saveBookSchema, fininshBookSchema, updateLearningNotesSchema } from "../validators/book.schema.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Books
 *     description: Books and user book lists
 */

/**
 * @openapi
 * /books/search:
 *   get:
 *     tags: [Books]
 *     summary: Search books
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Missing query
 */


router.get("/search", searchBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book details by Google book id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Book details
 */
router.get("/:id", getBookById);

/**
 * @openapi
 * /books/recommendations:
 *   get:
 *     tags: [Books]
 *     summary: Get recommendations (requires auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended books
 *       401:
 *         description: Unauthorized
 */
router.get("/recommendations", protect, getRecommendations);

/**
 * @openapi
 * /books/saved:
 *   get:
 *     tags: [Books]
 *     summary: Get saved books (requires auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved books
 */
router.get("/saved", protect, getSavedBooks);

/**
 * @openapi
 * /books/saved:
 *   post:
 *     tags: [Books]
 *     summary: Save a book (requires auth)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId: { type: string }
 *     responses:
 *       200:
 *         description: Saved
 */
router.post("/saved", protect, validate(saveBookSchema), saveBook);

/**
 * @openapi
 * /books/finished:
 *   get:
 *     tags: [Books]
 *     summary: Get finished books (requires auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Finished books
 */
router.get("/finished", protect, getFinishedBooks);

/**
 * @openapi
 * /books/finished:
 *   post:
 *     tags: [Books]
 *     summary: Mark book as finished (requires auth)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId: { type: string }
 *               learningNotes: { type: string }
 *     responses:
 *       200:
 *         description: Marked as finished
 */
router.post("/finished", protect, validate(fininshBookSchema), markBookAsFinished);

/**
 * @openapi
 * /books/finished/{bookId}/notes:
 *   put:
 *     tags: [Books]
 *     summary: Update learning notes for a finished book (requires auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [learningNotes]
 *             properties:
 *               learningNotes: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.put("/finished/:bookId/notes", protect, validate(updateLearningNotesSchema), updateLearningNotes);

/**
 * @openapi
 * /books/saved/{bookId}:
 *   delete:
 *     tags: [Books]
 *     summary: Remove saved book (requires auth)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removed
 */
router.delete("/saved/:bookId", protect, removeSavedBook);


export default router;