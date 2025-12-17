const express = require('express');
const router = express.Router();
const service = require('../services/hotelService');
const { authRequired } = require('../middleware/authMiddleware');
const { upload, getFileUrl } = require('../middleware/upload');

/**
 * @openapi
 * /api/v1/hotels:
 *   get:
 *     summary: Get paginated list of hotels
 *     tags:
 *       - Hotels
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
 *     responses:
 *       200:
 *         description: Paginated list of hotels
 */
router.get('/', async (req, res) => {
  const items = await service.listHotels();
  res.json(items);
});

/**
 * @openapi
 * /api/v1/hotels/{id}:
 *   get:
 *     summary: Get a hotel by ID
 *     tags:
 *       - Hotels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hotel found
 *       404:
 *         description: Hotel not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getHotel(req.params.id);
  if (!item) return res.status(404).json({ message: 'Hotel not found' });
  res.json(item);
});

/**
 * @openapi
 * /api/v1/hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags:
 *       - Hotels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - province
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Memot Riverside Hotel"
 *               province:
 *                 type: string
 *                 example: "Tbong Khmum"
 *               address:
 *                 type: string
 *                 example: "Memot Town, Tbong Khmum"
 *               starRating:
 *                 type: integer
 *                 example: 4
 *               phone:
 *                 type: string
 *                 example: "+85512340001"
 *               email:
 *                 type: string
 *                 example: "info@memotriverside.com"
 *               website:
 *                 type: string
 *                 example: "https://memotriverside.example.com"
 *               approved:
 *                 type: string
 *                 description: "true or false"
 *                 example: "true"
 *               location:
 *                 type: string
 *                 description: 'JSON string like {"lat":11.86,"lng":105.84}'
 *                 example: "{\"lat\":11.8605,\"lng\":105.8483}"
 *               priceRange:
 *                 type: string
 *                 description: 'JSON string like {"min":25,"max":80,"currency":"USD"}'
 *                 example: "{\"min\":25,\"max\":80,\"currency\":\"USD\"}"
 *               amenities:
 *                 type: string
 *                 description: 'JSON string array like ["Free WiFi","Parking"]'
 *                 example: "[\"Free WiFi\",\"Parking\",\"Breakfast\"]"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hotel image file
 *     responses:
 *       201:
 *         description: Hotel created
 *       400:
 *         description: Unable to create hotel
 */
router.post('/', authRequired, upload.single('image'), async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.createHotel({ ...req.body, images });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create hotel', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/hotels/{id}:
 *   put:
 *     summary: Update a hotel
 *     tags:
 *       - Hotels
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
 *               name:
 *                 type: string
 *               province:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hotel image file
 *               starRating:
 *                 type: integer
 *               priceRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *                   currency:
 *                     type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               approved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Hotel updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Hotel not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const images = req.file ? getFileUrl(req, req.file) : null;
    const item = await service.updateHotel(req.params.id, { ...req.body, images });
    if (!item) return res.status(404).json({ message: 'Hotel not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update hotel', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     tags:
 *       - Hotels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Hotel deleted
 *       404:
 *         description: Hotel not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteHotel(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Hotel not found' });
  res.status(204).send();
});

/**
 * @openapi
 * /api/v1/hotels/{id}/rooms:
 *   get:
 *     summary: Get all rooms for a specific hotel
 *     tags:
 *       - Hotels
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: List of rooms for the hotel
 */
router.get('/:id/rooms', async (req, res) => {
  const roomService = require('../services/roomService');
  const { isAvailable } = req.query;
  const where = {};
  if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';

  const items = await roomService.getRoomsByHotel(req.params.id, { ...req.query, where });
  res.json(items);
});

module.exports = router;
