import {Router} from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getPreferences, updatePreferences } from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { preferenceSchema } from "../validators/preference.schema.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User profile and preferences
 */

/**
 * @openapi
 * /users/preferences:
 *   get:
 *     tags: [Users]
 *     summary: Get user preferences (requires auth)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences
 *       401:
 *         description: Unauthorized
 */

router.get("/preferences", protect, getPreferences);

/**
 * @openapi
 * /users/preferences:
 *   put:
 *     tags: [Users]
 *     summary: Update user preferences (requires auth)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreferencesRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation error
 */
router.put("/preferences", protect, validate(preferenceSchema), updatePreferences);

export default router;