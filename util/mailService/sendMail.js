import 'dotenv/config';
import nodemailer from 'nodemailer';
import { sendMailViaHTTP } from './sendMailHTTP.js';


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

        let transporter = nodemailer.createTransporter(transporterConfig);

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
        
        // If SMTP fails and we're in production, try HTTP fallback
        if (process.env.NODE_ENV === 'production' && error.code === 'ETIMEDOUT') {
            console.log('Attempting fallback to HTTP email service...');
            try {
                const result = await sendMailViaHTTP(email, subject, text);
                console.log('Email sent successfully via HTTP fallback:', result);
                return result;
            } catch (fallbackError) {
                console.error('HTTP fallback also failed:', fallbackError);
                throw new Error(`Both SMTP and HTTP email methods failed. SMTP: ${error.message}, HTTP: ${fallbackError.message}`);
            }
        }
        
        throw error;
    }
}

export default sendMail;