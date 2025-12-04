const express = require('express');
const router = express.Router();
const service = require('../services/tourService');
const { authRequired } = require('../middleware/authMiddleware');

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
  const items = await service.listTours();
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
 *         application/json:
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
 *                 example: "ការធ្វើដំណើរថ្ងៃតែមើលចំការកៅស៊ូ Memot"
 *               descriptionEn:
 *                 type: string
 *               descriptionKh:
 *                 type: string
 *               duration:
 *                 type: string
 *                 example: "1 day"
 *               price:
 *                 type: number
 *                 example: 45
 *               itinerary:
 *                 type: array
 *                 description: List of steps in the tour
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "08:00"
 *                     activity:
 *                       type: string
 *                       example: "Pick-up from hotel"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               included:
 *                 type: array
 *                 items:
 *                   type: string
 *               excluded:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxPeople:
 *                 type: integer
 *                 example: 10
 *               province:
 *                 type: string
 *                 example: "Tbong Khmum"
 *               providerId:
 *                 type: string
 *                 description: User ID of provider
 *               approved:
 *                 type: boolean
 *               rating:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Tour created
 *       400:
 *         description: Validation error
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createTour(req.body);
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
 *         application/json:
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
 *                 type: array
 *                 items:
 *                   type: object
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               included:
 *                 type: array
 *                 items:
 *                   type: string
 *               excluded:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxPeople:
 *                 type: integer
 *               province:
 *                 type: string
 *               providerId:
 *                 type: string
 *               approved:
 *                 type: boolean
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tour updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tour not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateTour(req.params.id, req.body);
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
