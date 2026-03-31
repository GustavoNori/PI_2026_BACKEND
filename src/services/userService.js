import userModel from '../models/usuarioModel.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';

const createUser = async (name, email, password) => {
    const existingUser = await userModel.findById(email);

    if (existingUser) {
        throw new Error('Usuário já existe');
    }

    const password_hash = await hashPassword(password);

    const userId = await userModel.create(name, email, password_hash);

    return userId;
};

const loginUser = async (email, password) => {
    const user = await userModel.findById(email);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
        throw new Error('Senha inválida');
    }
    delete user.password_hash;
    return user;
};

export { createUser, loginUser };