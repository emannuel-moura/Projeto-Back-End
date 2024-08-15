const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para obter uma lista de produtos
router.get('/v1/product/search', productController.searchProducts);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para criar um novo produto
router.post('/v1/product', productController.createProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para atualizar um produto existente
router.put('/v1/product/:id', productController.updateProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para deletar um produto existente
router.delete('/v1/product/:id', productController.deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

// Endpoint para criar um produto (POST)
router.post('/', authenticateToken, productController.createProduct);

// Endpoint para atualizar um produto (PUT)
router.put('/:id', authenticateToken, productController.updateProduct);

// Endpoint para deletar um produto (DELETE)
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
