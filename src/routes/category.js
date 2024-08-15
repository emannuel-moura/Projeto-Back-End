const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/v1/category/search', categoryController.searchCategories);

module.exports = router;

const express = require('express');
const route = express.Router()
const categoryController = require('../controllers/categoryController');

// Rota para obter informações da categoria pelo ID
router.get('/v1/category/:id', categoryController.getCategoryById);

module.exports = router;

const express = require('express');const express = require('express');
const Rota = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/v1/category/search', categoryController.searchCategories);

// Rota para obter informações da categoria pelo ID
router.get('/v1/category/:id', categoryController.getCategoryById);

// Rota para cadastrar uma nova categoria
router.post('/v1/category', categoryController.createCategory);

// Rota para atualizar uma categoria existente
router.put('/v1/category/:id', categoryController.updateCategory);

// Rota para deletar uma categoria existente
router.delete('/v1/category/:id', categoryController.deleteCategory);

module.exports = router;
const rota = express.Router();
const categoryController = require('../controllers/categoryController');

// Rota para cadastrar uma nova categoria
router.post('/v1/category', categoryController.createCategory);

module.exports = router;

const express = require('express');
const rotas = express.Router();
const categoryController = require('../controllers/categoryController');

// Rota para atualizar uma categoria existente
router.put('/v1/category/:id', categoryController.updateCategory);

module.exports = router;
const express = require('express');
const rotas = express.Router();
const categoryController = require('../controllers/categoryController');

// Rota para deletar uma categoria existente
router.delete('/v1/category/:id', categoryController.deleteCategory);

module.exports = router;

const express = require('express');
const rotas = express.Router();
const categoryController = require('../controllers/categoryController');

// Rota para cadastrar uma nova categoria
router.post('/v1/category', categoryController.createCategory);

module.exports = router;
