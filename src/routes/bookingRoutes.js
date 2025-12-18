const express = require('express');
const router = express.Router();
const service = require('../services/bookingService');
const { authRequired } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/bookings:
 *   get:
 *     summary: Get paginated bookings
 *     tags:
 *       - Bookings
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
 *         description: Paginated list of bookings
 */
router.get('/', async (req, res) => {
  const items = await service.listBookings();
  res.json(items);
});

/**
 * @openapi
 * /api/v1/bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags:
 *       - Bookings
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
 *         description: Booking found
 *       404:
 *         description: Booking not found
 */
router.get('/:id', async (req, res) => {
  const item = await service.getBooking(req.params.id);
  if (!item) return res.status(404).json({ message: 'Booking not found' });
  res.json(item);
});

/**
 * @openapi
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - checkIn
 *               - checkOut
 *               - guests
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "uuid-of-user"
 *               tourId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-tour"
 *               hotelId:
 *                 type: string
 *                 nullable: true
 *                 example: "uuid-of-hotel"
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-10"
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-11"
 *               guests:
 *                 type: integer
 *                 example: 2
 *               totalPrice:
 *                 type: number
 *                 example: 90
 *               status:
 *                 type: string
 *                 example: "pending"
 *                 description: pending | confirmed | cancelled | completed
 *               paymentStatus:
 *                 type: string
 *                 example: "unpaid"
 *               paymentMethod:
 *                 type: string
 *                 example: "card"
 *               paymentTranId:
 *                 type: string
 *                 example: "TXN001"
 *               bakongTransactionId:
 *                 type: string
 *                 example: "BAKONG123"
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authRequired, async (req, res) => {
  try {
    // Ensure userId comes from the authenticated user if not provided or to enforce ownership
    const bookingData = { ...req.body, userId: req.user.id };
    const item = await service.createBooking(bookingData);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create booking', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags:
 *       - Bookings
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
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: integer
 *               totalPrice:
 *                 type: number
 *               status:
 *                 type: string
 *                 description: pending | confirmed | cancelled | completed
 *               paymentStatus:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               paymentTranId:
 *                 type: string
 *               bakongTransactionId:
 *                 type: string
 *               refundedAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateBooking(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Booking not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update booking', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/bookings/{id}:
 *   delete:
 *     summary: Cancel / delete a booking
 *     tags:
 *       - Bookings
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
 *         description: Booking removed
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteBooking(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Booking not found' });
  res.status(204).send();
});

module.exports = router;
