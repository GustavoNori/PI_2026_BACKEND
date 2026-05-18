import { AppDataSource } from "../../data-source.js";
import { UserEntity } from "../entities/User.js";
import { hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/hash.js";

export class AuthController {

    async getAllUsers(req, res){
        const repo = AppDataSource.getRepository(UserEntity);
        const users = await repo.find();
        return res.json(users);
    }

    async login(req, res){
    const repo = AppDataSource.getRepository(UserEntity);

    const { userName, password } = req.body;

    const user = await repo.findOne({
        where: { userName }
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
}

    async createUser(req, res){
        const repo = AppDataSource.getRepository(UserEntity);

        const { userName, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const user = repo.create({
            userName,
            password_hash: hashedPassword
        });

        await repo.save(user);

        return res.status(201).json({ message: "User created" });
    }

    async getOneUser(req, res){
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

    async updateUser(req, res){const repo = AppDataSource.getRepository(UserEntity);

        const { id } = req.params;
        const { userName, password } = req.body;

        const hashedPassword = await hashPassword(password);

        const userToUpdate = await repo.findOneBy({ id: parseInt(id) });

        if (!userToUpdate) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
        if (userName) userToUpdate.userName = userName;

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