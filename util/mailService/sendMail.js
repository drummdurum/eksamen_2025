import 'dotenv/config';
import nodemailer from 'nodemailer';


export async function sendMail(email, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sedrumm@gmail.com',
            pass: process.env.GmailserviceAppKode, 
        }
    });

    let info = await transporter.sendMail({
        from: `"BarToBar" <${transporter.options.auth.user}>`,
        to: email,
        subject: subject, 
        text: text,       
    });
}

export default sendMail;