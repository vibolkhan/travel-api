const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { authRequired } = require('../middleware/authMiddleware');

// Register
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

// List users (protected)
router.get('/', authRequired, async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

router.get('/:id', authRequired, async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update user', error: err.message });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.status(204).send();
});

module.exports = router;
