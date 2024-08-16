const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    use_in_menu: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    price_with_discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Product;


// Associações
Product.belongsToMany(Category, { through: 'ProductCategory', foreignKey: 'product_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
Product.hasMany(ProductOption, { foreignKey: 'product_id' });

module.exports = Product;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rota para obter informações do produto pelo ID
router.get('/v1/product/:id', productController.getProductById);

module.exports = router;


// Associações
Product.belongsToMany(Category, { through: 'ProductCategory', foreignKey: 'product_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
Product.hasMany(ProductOption, { foreignKey: 'product_id' });

module.exports = Product;
