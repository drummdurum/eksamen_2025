import crypto from 'crypto';
import db from './../../database/connection.js';

export async function generateResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex'); 
    const expiresAt = new Date(Date.now() + 3600000); 

    await db.run(`
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (?, ?, ?)
    `, [userId, token, expiresAt]);

    return token;
}