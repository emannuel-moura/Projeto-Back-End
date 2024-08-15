const Category = require('../models/category');

const searchCategories = async (req, res) => {
    const { limit = 12, page = 1, fields = 'id,name,slug,use_in_menu', use_in_menu } = req.query;

    try {
        // Configuração dos campos a serem retornados
        const attributes = fields.split(',');

        // Configuração de filtro para use_in_menu
        const where = {};
        if (use_in_menu !== undefined) {
            where.use_in_menu = use_in_menu === 'true';
        }

        // Configuração de paginação
        const queryOptions = {
            where,
            attributes,
            offset: limit == -1 ? undefined : (page - 1) * limit,
            limit: limit == -1 ? undefined : parseInt(limit, 10),
        };

        // Consulta ao banco de dados
        const categories = await Category.findAndCountAll(queryOptions);

        // Monta o resultado
        const response = {
            data: categories.rows,
            total: categories.count,
            limit: limit == -1 ? -1 : parseInt(limit, 10),
            page: parseInt(page, 10),
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    searchCategories,
};
const Category = require('../models/category');

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Busca a categoria pelo ID
        const category = await Category.findByPk(id, {
            attributes: ['id', 'name', 'slug', 'use_in_menu'],
        });

        // Se a categoria não for encontrada, retorna 404
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Se a categoria for encontrada, retorna os dados da categoria
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getCategoryById,
};
const Category = require('../models/category');

const createCategory = async (req, res) => {
    const { name, slug, use_in_menu } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !slug) {
        return res.status(400).json({ message: 'Name and slug are required' });
    }

    try {
        // Verifica se a categoria com o mesmo slug já existe
        const existingCategory = await Category.findOne({ where: { slug } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category with this slug already exists' });
        }

        // Cria a nova categoria
        const newCategory = await Category.create({
            name,
            slug,
            use_in_menu: use_in_menu !== undefined ? use_in_menu : false,
        });

        // Retorna a resposta com status 201 e a nova categoria
        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createCategory,
};

const Category = require('../models/category');

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    // Validação básica dos campos obrigatórios
    if (!name || !slug) {
        return res.status(400).json({ message: 'Name and slug are required' });
    }

    try {
        // Verifica se a categoria existe
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Atualiza a categoria com os novos dados
        await category.update({
            name,
            slug,
            use_in_menu: use_in_menu !== undefined ? use_in_menu : category.use_in_menu,
        });

        // Retorna o status 204 No Content
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    updateCategory,
};
const Category = require('../models/category');

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se a categoria existe
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Deleta a categoria
        await category.destroy();

        // Retorna o status 204 No Content
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    deleteCategory,
};
