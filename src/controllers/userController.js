const UserService = require('../services/userService');

class UserController {
    static async register(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserService.register(username, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const { user, token } = await UserService.login(username, password);
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = UserController;

const User = require('../models/user');

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'firstname', 'surname', 'email']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserById,
};

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    const { firstname, surname, email, password, confirmPassword } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!firstname || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Verifica se as senhas correspondem
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Verifica se o e-mail já está em uso
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const user = await User.create({
            firstname,
            surname,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            id: user.id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserById,
    createUser,
};
const User = require('../models/user');

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, surname, email } = req.body;

    // Verifica se todos os campos necessários estão presentes
    if (!firstname || !surname || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Verifica se o usuário existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Atualiza os dados do usuário
        await User.update(
            { firstname, surname, email },
            { where: { id } }
        );

        return res.status(204).send(); // No Content
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserById,
    createUser,
    updateUser,
};
const User = require('../models/user');

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se o usuário existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deleta o usuário
        await User.destroy({ where: { id } });

        return res.status(204).send(); // No Content
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
