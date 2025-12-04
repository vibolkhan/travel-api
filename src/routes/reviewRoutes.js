const express = require('express');
const router = express.Router();
const service = require('../services/reviewService');
const { authRequired } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/reviews:
 *   get:
 *     summary: Get paginated reviews
 *     tags:
 *       - Reviews
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
 *         description: Paginated list of reviews
 */
router.get('/', async (req, res) => {
  const items = await service.listReviews();
  res.json(items);
});

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review found
 *       404:
 *         description: Review not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getReview(req.params.id);
  if (!item) return res.status(404).json({ message: 'Review not found' });
  res.json(item);
});

/**
 * @openapi
 * /api/v1/reviews:
 *   post:
 *     summary: Add a review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Amazing experience, very friendly guide!"
 *               destinationId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-destination"
 *               tourId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-tour"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/reviews/rev-1.jpg"
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createReview(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create review', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags:
 *       - Reviews
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
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Good tour, but lunch was late."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/reviews/rev-1-edit.jpg"
 *     responses:
 *       200:
 *         description: Review updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateReview(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Review not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update review', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Reviews
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
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteReview(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Review not found' });
  res.status(204).send();
});

module.exports = router;
