const express = require('express');
const router = express.Router();

// Importa o controller
const homeController = require('../controllers/homeController');

// Define rota principal
router.get('/', homeController.home);

module.exports = router;
