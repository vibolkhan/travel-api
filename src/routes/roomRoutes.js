const express = require('express');
const router = express.Router();
const service = require('../services/roomService');
const { authRequired } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/rooms:
 *   get:
 *     summary: Get paginated list of rooms
 *     tags:
 *       - Rooms
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
 *       - in: query
 *         name: hotelId
 *         schema:
 *           type: string
 *         description: Filter by hotel ID
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: roomType
 *         schema:
 *           type: string
 *         description: Filter by room type
 *     responses:
 *       200:
 *         description: Paginated list of rooms
 */
router.get('/', async (req, res) => {
    const { hotelId, isAvailable, roomType } = req.query;
    const where = {};

    if (hotelId) where.hotelId = hotelId;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (roomType) where.roomType = roomType;

    const items = await service.listRooms({ ...req.query, where });
    res.json(items);
});

/**
 * @openapi
 * /api/v1/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room found
 *       404:
 *         description: Room not found
 */
router.get('/:id', async (req, res) => {
    const item = await service.getRoom(req.params.id);
    if (!item) return res.status(404).json({ message: 'Room not found' });
    res.json(item);
});

/**
 * @openapi
 * /api/v1/rooms:
 *   post:
 *     summary: Create a new room
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hotelId
 *               - roomNumber
 *               - roomType
 *               - capacity
 *               - pricePerNight
 *             properties:
 *               hotelId:
 *                 type: string
 *                 example: "uuid-of-hotel"
 *               roomNumber:
 *                 type: string
 *                 example: "101"
 *               roomType:
 *                 type: string
 *                 example: "Deluxe"
 *                 description: "e.g., Single, Double, Suite, Deluxe"
 *               capacity:
 *                 type: integer
 *                 example: 2
 *               floor:
 *                 type: integer
 *                 example: 1
 *               pricePerNight:
 *                 type: number
 *                 example: 75.00
 *               description:
 *                 type: string
 *                 example: "Spacious deluxe room with ocean view"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WiFi", "TV", "AC", "Mini Bar"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/room1.jpg"]
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Room created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authRequired, async (req, res) => {
    try {
        const item = await service.createRoom(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: 'Unable to create room', error: err.message });
    }
});

/**
 * @openapi
 * /api/v1/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags:
 *       - Rooms
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
 *               roomNumber:
 *                 type: string
 *               roomType:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               floor:
 *                 type: integer
 *               pricePerNight:
 *                 type: number
 *               description:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Room updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.put('/:id', authRequired, async (req, res) => {
    try {
        const item = await service.updateRoom(req.params.id, req.body);
        if (!item) return res.status(404).json({ message: 'Room not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: 'Unable to update room', error: err.message });
    }
});

/**
 * @openapi
 * /api/v1/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags:
 *       - Rooms
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
 *         description: Room deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Room not found
 */
router.delete('/:id', authRequired, async (req, res) => {
    const deleted = await service.deleteRoom(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Room not found' });
    res.status(204).send();
});

module.exports = router;
