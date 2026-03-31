import { compare, hash } from "bcrypt";
import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashPassword) =>{
    return await bcrypt.compare(password, hashPassword);
};

export { hashPassword, comparePassword}