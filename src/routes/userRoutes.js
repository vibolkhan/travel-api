const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { authRequired } = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Create a new user (admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: user | provider | admin
 *               phone:
 *                 type: string
 *               language:
 *                 type: string
 *                 default: en
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const plain = user.toJSON();
    delete plain.password;
    res.status(201).json(plain);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Unable to create user', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags:
 *       - Users
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
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           description: Optional filter by role (user, provider, admin)
 *     responses:
 *       200:
 *         description: Paginated list of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', authRequired, async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

/**
 * @openapi
 * /api/v1/users/me/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me/profile', authRequired, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
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
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', authRequired, async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
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
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               language:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Only admins can change role
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.put('/:id', authRequired, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update user', error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete or deactivate a user
 *     tags:
 *       - Users
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
 *         description: User removed
 *       404:
 *         description: User not found
 */
router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
});

module.exports = router;
