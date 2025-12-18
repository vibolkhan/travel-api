const express = require('express');
const router = express.Router();
const service = require('../services/tourService');
const { authRequired } = require('../middleware/authMiddleware');
const { upload, getFileUrl } = require('../middleware/upload');

/**
 * @openapi
 * /api/v1/tours:
 *   get:
 *     summary: Get paginated list of tours
 *     tags:
 *       - Tours
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
 *         description: Paginated list of tours
 */
router.get('/', async (req, res) => {
  const items = await service.listTours(req.query);
  res.json(items);
});

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   get:
 *     summary: Get a tour by ID
 *     tags:
 *       - Tours
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour found
 *       404:
 *         description: Tour not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getTour(req.params.id);
  if (!item) return res.status(404).json({ message: 'Tour not found' });
  res.json(item);
});

/**
 * @openapi
 * /api/v1/tours:
 *   post:
 *     summary: Create a new tour
 *     tags:
 *       - Tours
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titleEn
 *               - price
 *               - province
 *               - providerId
 *             properties:
 *               titleEn:
 *                 type: string
 *                 example: "Memot Rubber Plantation Day Tour"
 *               titleKh:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               descriptionKh:
 *                 type: string
 *               duration:
 *                 type: string
 *               price:
 *                 type: number
 *               itinerary:
 *                 type: string
 *                 description: 'JSON array string like [{"time":"08:00","activity":"..."}]'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Tour image file
 *               included:
 *                 type: string
 *                 description: 'JSON array string like ["Lunch", "Guide"]'
 *               excluded:
 *                 type: string
 *                 description: 'JSON array string like ["Tips"]'
 *               maxPeople:
 *                 type: integer
 *               province:
 *                 type: string
 *               providerId:
 *                 type: string
 *               destinationId:
 *                 type: string
 *               approved:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tour created
 *       400:
 *         description: Validation error
 */
router.post('/', authRequired, upload.single('image'), async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.createTour({ ...req.body, images });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create tour', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   put:
 *     summary: Update a tour
 *     tags:
 *       - Tours
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titleEn:
 *                 type: string
 *               titleKh:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               descriptionKh:
 *                 type: string
 *               duration:
 *                 type: string
 *               price:
 *                 type: number
 *               itinerary:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               included:
 *                 type: string
 *               excluded:
 *                 type: string
 *               maxPeople:
 *                 type: integer
 *               province:
 *                 type: string
 *               providerId:
 *                 type: string
 *               destinationId:
 *                 type: string
 *               approved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tour updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tour not found
 */
router.put('/:id', authRequired, upload.single('image'), async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.updateTour(req.params.id, { ...req.body, images });
    if (!item) return res.status(404).json({ message: 'Tour not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update tour', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/tours/{id}:
 *   delete:
 *     summary: Delete a tour
 *     tags:
 *       - Tours
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deleted
 *       404:
 *         description: Tour not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteTour(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Tour not found' });
  res.status(204).send();
});

module.exports = router;
