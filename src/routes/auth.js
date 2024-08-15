const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para gerar o token JWT
router.post('/v1/user/token', authController.generateToken);

module.exports = router;
