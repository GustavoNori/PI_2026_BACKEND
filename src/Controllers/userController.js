import { AppDataSource } from "../../data-source.js";
import { UserEntity } from "../entities/User.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/hash.js";

export class AuthController {

    async getAllUsers(req, res) {
        const repo = AppDataSource.getRepository(UserEntity);
        const users = await repo.find();
        return res.json(users);
    }

    async login(req, res) {
        try {
            const repo = AppDataSource.getRepository(UserEntity);

            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({ message: "Identifier and password are required" });
            }

            const user = await repo.findOne({
                where: [
                    { name: identifier },
                    { email: identifier } // Certifique-se de que sua UserEntity possui a propriedade 'email'
                ]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isValid = await comparePassword(password, user.password_hash);

            if (!isValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = generateToken(user);

            return res.json({
                message: "Login realizado",
                token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async createUser(req, res) {
        const repo = AppDataSource.getRepository(UserEntity);

        const { name, email, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const user = repo.create({
            name,
            email,
            password_hash: hashedPassword
        });

        await repo.save(user);

        return res.status(201).json({ message: "User created" });
    }

    async getOneUser(req, res) {
        const repo = AppDataSource.getRepository(UserEntity);

        const { id } = req.params;

        const user = await repo.findOne({
            where: { id: parseInt(id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(user);
    }

    async updateUser(req, res) {
        const repo = AppDataSource.getRepository(UserEntity);

        const { id } = req.params;
        const { name, email, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const userToUpdate = await repo.findOneBy({ id: parseInt(id) });

        if (!userToUpdate) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        if (name) userToUpdate.name = name;
        if (email) userToUpdate.email = email;

        if (password) {
            userToUpdate.password_hash = await hashPassword(password);
        }
        await repo.save(userToUpdate);

        return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    }

    async deleteUser(req, res) {
        const repo = AppDataSource.getRepository(UserEntity);

        const { id } = req.params;

        const userToDelete = await repo.findOneBy({ id: parseInt(id) });

        if (!userToDelete) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        await repo.remove(userToDelete);

        return res.status(200).json({ message: "Usuário removido com sucesso" });
    }
}