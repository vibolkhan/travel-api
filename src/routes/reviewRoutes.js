const express = require('express');
const router = express.Router();
const service = require('../services/reviewService');
const { authRequired } = require('../middleware/authMiddleware');
const { upload, getFileUrl } = require('../middleware/upload');

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
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Optional filter by user ID
 *       - in: query
 *         name: destinationId
 *         schema:
 *           type: string
 *         description: Optional filter by destination ID
 *       - in: query
 *         name: tourId
 *         schema:
 *           type: string
 *         description: Optional filter by tour ID
 *     responses:
 *       200:
 *         description: Paginated list of reviews
 */
router.get('/', async (req, res) => {
  const { page, limit, userId, destinationId, tourId } = req.query;

  const where = {};
  if (userId) where.userId = userId;
  if (destinationId) where.destinationId = destinationId;
  if (tourId) where.tourId = tourId;

  const items = await service.listReviews({ page, limit, where });
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
 *         description: Review ID
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
 *     summary: Create a new review (single image upload)
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "Optional, will use token user if omitted"
 *               destinationId:
 *                 type: string
 *                 description: "Required if tourId is missing"
 *               tourId:
 *                 type: string
 *                 description: "Required if destinationId is missing"
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: "Single review image file"
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Unable to create review
 */
router.post('/', authRequired, upload.single('images'), async (req, res) => {
  try {
    const tokenUser = req.user || {};
    const tokenUserId = tokenUser.sub || tokenUser.id || tokenUser.userId;
    const bodyUserId = req.body.userId;
    const userId = tokenUserId || bodyUserId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'userId is required (from token or body)' });
    }

    const { destinationId, tourId, rating, comment } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file);
    }

    const item = await service.createReview({
      userId,
      destinationId: destinationId || null,
      tourId: tourId || null,
      rating: rating ? Number(rating) : null,
      comment: comment || null,
      images: imageUrl ? [imageUrl] : null
    });

    res.status(201).json(item);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Unable to create review', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Update a review (optionally with a new image)
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
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: "Optional new review image file"
 *     responses:
 *       200:
 *         description: Review updated
 *       404:
 *         description: Review not found
 */
router.put('/:id', authRequired, upload.single('images'), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = getFileUrl(req, req.file);
    }

    const data = {
      rating: rating ? Number(rating) : undefined,
      comment: typeof comment !== 'undefined' ? comment : undefined
    };

    if (typeof imageUrl !== 'undefined') {
      data.images = [imageUrl];
    }

    const item = await service.updateReview(req.params.id, data);
    if (!item) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(item);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Unable to update review', error: err.message });
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
 *         description: Review ID
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
