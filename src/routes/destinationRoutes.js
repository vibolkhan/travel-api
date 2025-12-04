const express = require('express');
const router = express.Router();
const service = require('../services/destinationService');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const items = await service.listDestinations();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await service.getDestination(req.params.id);
  if (!item) return res.status(404).json({ message: 'Destination not found' });
  res.json(item);
});

router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createDestination(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create destination', error: err.message });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateDestination(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Destination not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update Destination', error: err.message });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteDestination(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Destination not found' });
  res.status(204).send();
});

module.exports = router;
