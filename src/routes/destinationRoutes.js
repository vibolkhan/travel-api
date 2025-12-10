const express = require('express');
const router = express.Router();
const service = require('../services/destinationService');
const { authRequired } = require('../middleware/authMiddleware');
const { upload, getFileUrl } = require('../middleware/upload');

/**
 * @openapi
 * /api/v1/destinations:
 *   get:
 *     summary: Get paginated list of destinations
 *     tags:
 *       - Destinations
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
 *         description: Paginated list of destinations
 */
router.get('/', async (req, res) => {
  const items = await service.listDestinations();
  res.json(items);
});

/**
 * @openapi
 * /api/v1/destinations/{id}:
 *   get:
 *     summary: Get an destination by ID
 *     tags:
 *       - Destinations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination found
 *       404:
 *         description: Destination not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getDestination(req.params.id);
  if (!item) return res.status(404).json({ message: 'Destination not found' });
  res.json(item);
});

/**
 * @openapi
 * /api/v1/destinations:
 *   post:
 *     summary: Create a new destination
 *     tags:
 *       - Destinations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nameEn
 *               - province
 *             properties:
 *               nameEn:
 *                 type: string
 *                 example: "Rubber Plantation Viewpoint"
 *               nameKh:
 *                 type: string
 *                 example: "ចំណុចមើលទេសភាពចំការកៅស៊ូ"
 *               descriptionEn:
 *                 type: string
 *               descriptionKh:
 *                 type: string
 *               province:
 *                 type: string
 *                 example: "Tbong Khmum"
 *               district:
 *                 type: string
 *                 example: "Memot"
 *               location:
 *                 type: string
 *                 description: 'JSON object string: {"lat": 11.1, "lng": 105.2}'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Destination image file
 *               ticketPrice:
 *                 type: number
 *                 example: 2.5
 *               openingHours:
 *                 type: string
 *                 example: "08:00-17:00"
 *               category:
 *                 type: string
 *                 example: "Nature"
 *               featured:
 *                 type: boolean
 *               approved:
 *                 type: boolean
 *               views:
 *                 type: integer
 *               rating:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Destination created
 *       400:
 *         description: Validation error
 */
router.post('/', authRequired, upload.single('image'), async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.createDestination({ ...req.body, images });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create destination', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/destinations/{id}:
 *   put:
 *     summary: Update an destination
 *     tags:
 *       - Destinations
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
 *               nameEn:
 *                 type: string
 *               nameKh:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               descriptionKh:
 *                 type: string
 *               province:
 *                 type: string
 *               district:
 *                 type: string
 *               location:
 *                 type: string
 *                 description: 'JSON object string'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Destination image file
 *               ticketPrice:
 *                 type: number
 *               openingHours:
 *                 type: string
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               approved:
 *                 type: boolean
 *               views:
 *                 type: integer
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Destination updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Destination not found
 */
router.put('/:id', authRequired, upload.single('image'), async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.updateDestination(req.params.id, { ...req.body, images: [images] });
    if (!item) return res.status(404).json({ message: 'Destination not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update Destination', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/destinations/{id}:
 *   delete:
 *     summary: Delete an destination
 *     tags:
 *       - Destinations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Destination deleted
 *       404:
 *         description: Destination not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteDestination(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Destination not found' });
  res.status(204).send();
});

module.exports = router;
