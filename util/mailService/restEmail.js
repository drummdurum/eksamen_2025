import bcrypt from 'bcrypt';
import sendMail from './../mailService/sendMail.js'
import db from './../../database/connection.js'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080'; 

export async function sendResetEmail(email, token) {
    const resetLink = `${BASE_URL}/reset-password?token=${token}`;
    const subject = "Nulstilling af adgangskode";
    const text = `Klik på dette link for at nulstille din adgangskode: ${resetLink}`;

    console.log('SendResetEmail called:', {
        email: email,
        resetLink: resetLink,
        baseUrl: BASE_URL
    });

    const result = await sendMail(email, subject, text);
    return result;
}

export async function validateResetToken(token) {
    const result = await db.get(`
        SELECT * FROM password_reset_tokens
        WHERE token = ? AND expires_at > ?
    `, [token, new Date()]);

    return result; 
}

export async function updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.run(`
        UPDATE users SET password = ? WHERE id = ?
    `, [hashedPassword, userId]);

    await db.run(`
        DELETE FROM password_reset_tokens WHERE user_id = ?
    `, [userId]);
}