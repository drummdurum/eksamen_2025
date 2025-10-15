import bcrypt from 'bcrypt';
import sendMail from './../mailService/sendMail.js'
import db from './../../database/connection.js'

// Automatically detect the correct base URL based on environment
function getBaseUrl() {
    // If we're on Railway (production), construct the URL from Railway's provided domain
    if (process.env.NODE_ENV === 'production') {
        // Railway provides RAILWAY_PUBLIC_DOMAIN or we can construct from service name
        if (process.env.RAILWAY_PUBLIC_DOMAIN) {
            return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
        }
        // Fallback: construct Railway URL (replace with your actual Railway domain)
        return 'https://eksamen2025-production.up.railway.app';
    }
    
    // Development environment
    return process.env.BASE_URL || 'http://localhost:8080';
}

const BASE_URL = getBaseUrl(); 

export async function sendResetEmail(email, token) {
    const resetLink = `${BASE_URL}/reset-password?token=${token}`;
    const subject = "Nulstilling af adgangskode";
    const text = `Klik på dette link for at nulstille din adgangskode: ${resetLink}`;

    console.log('SendResetEmail called:', {
        email: email,
        resetLink: resetLink,
        baseUrl: BASE_URL,
        nodeEnv: process.env.NODE_ENV,
        railwayDomain: process.env.RAILWAY_PUBLIC_DOMAIN
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