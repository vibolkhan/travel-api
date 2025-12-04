const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
