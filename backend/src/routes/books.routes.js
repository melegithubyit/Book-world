import { Router } from "express";
import { searchBooks, getBookById, getRecommendations, getSavedBooks, saveBook, markBookAsFinished, getFinishedBooks, removeSavedBook, removeFinishedBook, updateLearningNotes } from "../controllers/book.controller.js";
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
 *         description: Search query text
 *         schema: { type: string }
 *       - in: query
 *         name: startIndex
 *         required: false
 *         description: Index of the first result to return
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: maxResults
 *         required: false
 *         description: Number of results to return
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: query
 *         name: orderBy
 *         required: false
 *         description: Sort order (passed through to Google Books)
 *         schema:
 *           type: string
 *           example: relevance
 *       - in: query
 *         name: printType
 *         required: false
 *         description: Print type filter (passed through to Google Books)
 *         schema:
 *           type: string
 *           example: books
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookSearchResponse'
 *       400:
 *         description: Missing query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.get("/search", searchBooks);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookSearchResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error fetching recommendations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookSnapshot'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             $ref: '#/components/schemas/SaveBookRequest'
 *     responses:
 *       200:
 *         description: Saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation error / already saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookSnapshot'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             $ref: '#/components/schemas/FinishBookRequest'
 *     responses:
 *       200:
 *         description: Marked as finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation error / already finished
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             $ref: '#/components/schemas/UpdateLearningNotesRequest'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Book not found in finished books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/finished/:bookId/notes", protect, validate(updateLearningNotesSchema), updateLearningNotes);

/**
 * @openapi
 * /books/finished/{bookId}:
 *   delete:
 *     tags: [Books]
 *     summary: Remove finished book (requires auth)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/finished/:bookId", protect, removeFinishedBook);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/saved/:bookId", protect, removeSavedBook);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookSnapshot'
 *       500:
 *         description: Error fetching book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getBookById);


export default router;