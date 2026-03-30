import { createUser, loginUser } from '../services/userService.js';

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userId = await createUser(name, email, password);

        res.status(201).json({ userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export { register, login };