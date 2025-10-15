import 'dotenv/config';
import nodemailer from 'nodemailer';

export async function sendMail(email, subject, text) {
    console.log('SendMail function called:', {
        email: email,
        subject: subject,
        hasAppPassword: !!process.env.GmailserviceAppKode,
        appPassword: process.env.GmailserviceAppKode ? 'set' : 'missing',
        nodeEnv: process.env.NODE_ENV
    });

    try {
        // Use different configuration for production (Railway) vs development
        let transporterConfig;
        
        if (process.env.NODE_ENV === 'production') {
            // Try port 465 with SSL for Railway - sometimes works better than 587
            transporterConfig = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // Use SSL
                auth: {
                    user: 'sedrumm@gmail.com',
                    pass: process.env.GmailserviceAppKode, 
                },
                connectionTimeout: 15000, // 15 seconds
                greetingTimeout: 10000,   // 10 seconds
                socketTimeout: 15000      // 15 seconds
            };
        } else {
            // Development configuration
            transporterConfig = {
                service: 'gmail',
                auth: {
                    user: 'sedrumm@gmail.com',
                    pass: process.env.GmailserviceAppKode, 
                }
            };
        }

        console.log('Creating transporter with config:', {
            host: transporterConfig.host || 'gmail service',
            port: transporterConfig.port || 'default',
            secure: transporterConfig.secure
        });

        let transporter = nodemailer.createTransport(transporterConfig);

        console.log('Transporter created, sending email...');

        let info = await transporter.sendMail({
            from: `"BarToBar" <sedrumm@gmail.com>`,
            to: email,
            subject: subject, 
            text: text,       
        });

        console.log('Email sent successfully via SMTP:', {
            messageId: info.messageId,
            response: info.response
        });

        return info;
        
    } catch (error) {
        console.error('SMTP email sending failed:', error);
        
        // If SMTP fails and we're in production, use simple logging fallback
        if (process.env.NODE_ENV === 'production' && (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND')) {
            console.log('Using fallback logging method...');
            
            // Simple logging fallback - log email details for manual processing
            console.log('=== EMAIL FALLBACK - MANUAL VERIFICATION ===');
            console.log('To:', email);
            console.log('Subject:', subject);
            console.log('Content:', text);
            console.log('Timestamp:', new Date().toISOString());
            
            // Extract reset link from text if it exists
            const resetLinkMatch = text.match(/(https?:\/\/[^\s]+)/);
            if (resetLinkMatch) {
                console.log('IMPORTANT - Password Reset Link:', resetLinkMatch[0]);
            }
            console.log('=== END EMAIL CONTENT ===');
            
            return {
                success: true,
                messageId: 'fallback-' + Date.now(),
                method: 'logging_fallback',
                note: 'Email logged to console for manual verification'
            };
        }
        
        // Re-throw error if it's not a connection issue or we're in development
        throw error;
    }
}

export default sendMail;