import db from '../Database/connection.js';

const userModel = { 
    create: async (name, email, password_hash) => {
    const query = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, email, password_hash]);
    return result.insertId;
},

    findById: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(query, [email]);
    return rows[0]; 
},
    update: async (id, data) => {
        const query = 'UPDATE users SET nome = ? WHERE id = ?';
        const [result] = await db.query(query, [data.name, id]);
        return result.affectedRows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows;
    }

}


export default userModel