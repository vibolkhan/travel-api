const express = require('express');
const router = express.Router();
const service = require('../services/hotelService');
const { authRequired } = require('../middleware/authMiddleware');

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
 *         application/json:
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
 *               location:
 *                 type: object
 *                 description: Lat/Lng JSON object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 11.8605
 *                   lng:
 *                     type: number
 *                     example: 105.8483
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/hotels/hotel-1.jpg"
 *               starRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               priceRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     example: 25
 *                   max:
 *                     type: number
 *                     example: 80
 *                   currency:
 *                     type: string
 *                     example: "USD"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Free WiFi"
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
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Hotel created
 *       400:
 *         description: Validation error
 */
router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createHotel(req.body);
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
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
    const item = await service.updateHotel(req.params.id, req.body);
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

module.exports = router;
