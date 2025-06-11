const express = require('express');
const { createEntry, getEntries, getEntryById, updateEntry, deleteEntry, getSummary } = require('../controllers/entryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createEntry);
router.get('/', authMiddleware, getEntries);
router.get('/summary', authMiddleware, getSummary);
router.get('/:id', authMiddleware, getEntryById);
router.put('/:id', authMiddleware, updateEntry);
router.delete('/:id', authMiddleware, deleteEntry);


module.exports = router;