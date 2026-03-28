import { NOMEM } from 'node:dns';
import db from '../database/connection.js';

export const createUser = async (name, email, password_hash) => {
    const query = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, email, password_hash]);
    return result.insertId;
}

export const buscarPorEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0]; 
};