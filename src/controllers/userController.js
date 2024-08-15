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
