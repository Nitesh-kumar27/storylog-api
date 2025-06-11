const express = require('express');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', healthCheck);
router.get('/', healthCheck); 
   

module.exports = router;