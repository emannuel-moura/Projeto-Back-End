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
const authenticateToken = require('../middleware/authenticateToken');

router.put('/v1/category/:id', authenticateToken, categoryController.updateCategory);
module.exports = router;
const authenticateToken = require('../middleware/authenticateToken');

router.post('/v1/category', authenticateToken, categoryController.createCategory);
const authenticateToken = require('../middleware/authenticateToken');

router.delete('/v1/category/:id', authenticateToken, categoryController.deleteCategory);

const authenticateToken = require('../middleware/authenticateToken');

router.post('/v1/category', authenticateToken, categoryController.createCategory);
