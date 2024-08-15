const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Exemplo de rota protegida
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

module.exports = router;
