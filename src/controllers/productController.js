const { Op } = require('sequelize');
const Product = require('../models/product');
const Category = require('../models/category');
const ProductImage = require('../models/productImage');
const ProductOption = require('../models/productOption');

const searchProducts = async (req, res) => {
    const {
        limit = 12,
        page = 1,
        fields,
        match,
        category_ids,
        price_range,
        option
    } = req.query;

    const queryOptions = {
        where: {},
        include: [],
        limit: limit !== '-1' ? parseInt(limit) : undefined,
        offset: limit !== '-1' ? (parseInt(page) - 1) * parseInt(limit) : undefined,
    };

    // Filtrando por nome ou descrição
    if (match) {
        queryOptions.where = {
            ...queryOptions.where,
            [Op.or]: [
                { name: { [Op.like]: `%${match}%` } },
                { description: { [Op.like]: `%${match}%` } }
            ]
        };
    }

    // Filtrando por IDs de categorias
    if (category_ids) {
        queryOptions.include.push({
            model: Category,
            where: { id: category_ids.split(',') },
            through: { attributes: [] }
        });
    }

    // Filtrando por faixa de preço
    if (price_range) {
        const [minPrice, maxPrice] = price_range.split('-').map(price => parseFloat(price));
        queryOptions.where = {
            ...queryOptions.where,
            price: { [Op.between]: [minPrice, maxPrice] }
        };
    }

    // Filtrando por opções do produto
    if (option) {
        Object.keys(option).forEach(optionId => {
            const optionValues = option[optionId].split(',');
            queryOptions.include.push({
                model: ProductOption,
                where: {
                    id: optionId,
                    values: { [Op.or]: optionValues }
                }
            });
        });
    }

    // Selecionando campos específicos
    if (fields) {
        queryOptions.attributes = fields.split(',');
    }

    // Incluindo imagens dos produtos
    queryOptions.include.push({
        model: ProductImage,
        attributes: ['id', 'path']
    });

    try {
        // Buscando produtos com os filtros aplicados
        const { rows: data, count: total } = await Product.findAndCountAll(queryOptions);

        // Formatação do resultado
        const formattedData = data.map(product => ({
            ...product.toJSON(),
            images: product.productImages.map(image => ({
                id: image.id,
                content: image.path
            })),
        }));

        return res.status(200).json({
            data: formattedData,
            total,
            limit: parseInt(limit),
            page: parseInt(page),
        });
    } catch (error) {
        return res.status(400).json({ message: 'Bad Request', error: error.message });
    }
};

module.exports = {
    searchProducts,
};
const Product = require('../models/product');
const ProductImage = require('../models/productImage');
const ProductOption = require('../models/productOption');
const Category = require('../models/category');

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: ProductImage,
                    attributes: ['id', 'path']
                },
                {
                    model: ProductOption,
                    attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
                },
                {
                    model: Category,
                    attributes: ['id'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productData = product.toJSON();
        const categoryIds = productData.categories.map(cat => cat.id);
        const images = productData.productImages.map(img => ({
            id: img.id,
            content: img.path
        }));

        return res.status(200).json({
            id: productData.id,
            enabled: productData.enabled,
            name: productData.name,
            slug: productData.slug,
            stock: productData.stock,
            description: productData.description,
            price: productData.price,
            price_with_discount: productData.price_with_discount,
            category_ids: categoryIds,
            images,
            options: productData.productOptions
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    getProductById,
};
const { Product, ProductImage, ProductOption, Category } = require('../models');
const { validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Função para salvar imagens temporariamente
const saveImage = (base64Data, fileName) => {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(__dirname, '../../uploads', fileName);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
};

const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

    try {
        // Cria o produto
        const product = await Product.create({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Adiciona categorias
        if (category_ids && category_ids.length > 0) {
            await product.addCategories(category_ids);
        }

        // Salva e associa as imagens
        if (images && images.length > 0) {
            const imagePromises = images.map(async (image, index) => {
                const fileName = `product-${product.id}-image-${index + 1}.${image.type.split('/')[1]}`;
                const filePath = await saveImage(image.content, fileName);
                
                return ProductImage.create({
                    product_id: product.id,
                    path: filePath,
                    enabled: true
                });
            });
            await Promise.all(imagePromises);
        }

        // Adiciona as opções do produto
        if (options && options.length > 0) {
            const optionPromises = options.map(option => {
                return ProductOption.create({
                    product_id: product.id,
                    title: option.title,
                    shape: option.shape,
                    radius: parseInt(option.radius, 10) || 0,
                    type: option.type,
                    values: option.values.join(',')
                });
            });
            await Promise.all(optionPromises);
        }

        return res.status(201).json({
            id: product.id,
            enabled: product.enabled,
            name: product.name,
            slug: product.slug,
            stock: product.stock,
            description: product.description,
            price: product.price,
            price_with_discount: product.price_with_discount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    createProduct,
};
const { Product, ProductImage, ProductOption, Category } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Função para salvar imagens temporariamente
const saveImage = (base64Data, fileName) => {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(__dirname, '../../uploads', fileName);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
};

const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;

    try {
        // Verifica se o produto existe
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Atualiza o produto
        await product.update({
            enabled,
            name,
            slug,
            stock,
            description,
            price,
            price_with_discount
        });

        // Atualiza as categorias
        if (category_ids && category_ids.length > 0) {
            await product.setCategories(category_ids);
        }

        // Atualiza e associa as imagens
        if (images && images.length > 0) {
            // Exclui as imagens marcadas como deletadas
            const deleteImagePromises = images
                .filter(image => image.deleted)
                .map(async (image) => {
                    const imageToDelete = await ProductImage.findByPk(image.id);
                    if (imageToDelete) {
                        fs.unlinkSync(imageToDelete.path); // Remove o arquivo da pasta uploads
                        await imageToDelete.destroy();
                    }
                });
            await Promise.all(deleteImagePromises);

            // Salva novas imagens e atualiza imagens existentes
            const imagePromises = images.map(async (image) => {
                if (image.id && !image.deleted) {
                    // Atualiza imagem existente
                    const existingImage = await ProductImage.findByPk(image.id);
                    if (existingImage) {
                        if (image.content) {
                            const fileName = path.basename(existingImage.path);
                            const filePath = await saveImage(image.content, fileName);
                            existingImage.path = filePath;
                            await existingImage.save();
                        }
                    }
                } else if (image.content) {
                    // Adiciona nova imagem
                    const fileName = `product-${product.id}-image-${Date.now()}.${image.type.split('/')[1]}`;
                    const filePath = await saveImage(image.content, fileName);
                    await ProductImage.create({
                        product_id: product.id,
                        path: filePath,
                        enabled: true
                    });
                }
            });
            await Promise.all(imagePromises);
        }

        // Atualiza as opções do produto
        if (options && options.length > 0) {
            // Exclui opções marcadas como deletadas
            const deleteOptionPromises = options
                .filter(option => option.deleted)
                .map(async (option) => {
                    const optionToDelete = await ProductOption.findByPk(option.id);
                    if (optionToDelete) {
                        await optionToDelete.destroy();
                    }
                });
            await Promise.all(deleteOptionPromises);

            // Adiciona e atualiza opções
            const optionPromises = options.map(async (option) => {
                if (option.id && !option.deleted) {
                    // Atualiza opção existente
                    const existingOption = await ProductOption.findByPk(option.id);
                    if (existingOption) {
                        existingOption.radius = parseInt(option.radius, 10) || 0;
                        existingOption.values = option.values ? option.values.join(',') : existingOption.values;
                        await existingOption.save();
                    }
                } else if (option.title) {
                    // Adiciona nova opção
                    await ProductOption.create({
                        product_id: product.id,
                        title: option.title,
                        shape: option.shape,
                        radius: parseInt(option.radius, 10) || 0,
                        type: option.type,
                        values: option.values.join(',')
                    });
                }
            });
            await Promise.all(optionPromises);
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    updateProduct,
};
const { Product, ProductImage, ProductOption } = require('../models');
const { validationResult } = require('express-validator');

const deleteProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
        // Verifica se o produto existe
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove todas as imagens associadas ao produto
        const images = await ProductImage.findAll({ where: { product_id: id } });
        images.forEach(image => {
            fs.unlinkSync(image.path); // Remove o arquivo da pasta uploads
        });
        await ProductImage.destroy({ where: { product_id: id } });

        // Remove todas as opções associadas ao produto
        await ProductOption.destroy({ where: { product_id: id } });

        // Remove o produto
        await product.destroy();

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = {
    deleteProduct,
};
