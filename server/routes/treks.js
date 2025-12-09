const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getTreks,
  getTrekById,
  createTrek,
  updateTrek,
  deleteTrek,
} = require('../controllers/trekController');

const router = express.Router();

router.get('/', getTreks);

router.get('/:id', getTrekById);

router.post('/', protect, createTrek);

router.put('/:id', protect, updateTrek);

router.delete('/:id', protect, deleteTrek);

module.exports = router;
