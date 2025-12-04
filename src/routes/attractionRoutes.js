const express = require('express');
const router = express.Router();
const service = require('../services/attractionService');
const { authRequired } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const items = await service.listAttractions();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await service.getAttraction(req.params.id);
  if (!item) return res.status(404).json({ message: 'Attraction not found' });
  res.json(item);
});

router.post('/', authRequired, async (req, res) => {
  try {
    const item = await service.createAttraction(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to create attraction', error: err.message });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const item = await service.updateAttraction(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Attraction not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Unable to update attraction', error: err.message });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await service.deleteAttraction(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Attraction not found' });
  res.status(204).send();
});

module.exports = router;
