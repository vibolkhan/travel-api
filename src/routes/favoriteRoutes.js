const express = require('express');
const router = express.Router();
const service = require('../services/favoriteService');
const { authRequired } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/favorites:
 *   get:
 *     summary: Get current user's favorites
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated favorites
 */
router.get('/', async (req, res) => {
  const items = await service.listFavorites();
  res.json(items);
});

/**
 * @openapi
 * /api/v1/favorites/{id}:
 *   get:
 *     summary: Get a favorite by ID
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite found
 *       404:
 *         description: Favorite not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getFavorite(req.params.id);
  if (!item) return res.status(404).json({ message: 'Favorite not found' });
  res.json(item);
});


/**
 * @openapi
 * /api/v1/favorites:
 *   post:
 *     summary: Add a favorite (tour or destination)
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Provide either destinationId or tourId
 *             properties:
 *               destinationId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-destination"
 *               tourId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-tour"
 *     responses:
 *       201:
 *         description: Favorite added
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createFavorite(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create favorite', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/favorites/{id}:
 *   put:
 *     summary: Update a favorite (change linked tour/destination)
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Provide new destinationId or tourId
 *             properties:
 *               destinationId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-destination"
 *               tourId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-tour"
 *     responses:
 *       200:
 *         description: Favorite updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favorite not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateFavorite(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Favorite not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update favorite', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/favorites/{id}:
 *   delete:
 *     summary: Remove a favorite
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Favorite removed
 *       404:
 *         description: Favorite not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteFavorite(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Favorite not found' });
  res.status(204).send();
});

module.exports = router;
