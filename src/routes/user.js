const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/v1/user/:id', userController.getUserById);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/v1/user/:id', userController.getUserById);
router.post('/v1/user', userController.createUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/v1/user/:id', userController.getUserById);
router.post('/v1/user', userController.createUser);
router.put('/v1/user/:id', authMiddleware, userController.updateUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/v1/user/:id', userController.getUserById);
router.post('/v1/user', userController.createUser);
router.put('/v1/user/:id', authMiddleware, userController.updateUser);
router.delete('/v1/user/:id', authMiddleware, userController.deleteUser);  // Adiciona rota DELETE

module.exports = router;
const authenticateToken = require('../middleware/authenticateToken');

router.post('/v1/category', authenticateToken, categoryController.createCategory);

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Endpoint para atualizar um usuário (PUT)
router.put('/:id', authenticateToken, userController.updateUser);

// Endpoint para deletar um usuário (DELETE)
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
