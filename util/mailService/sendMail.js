import 'dotenv/config';
import nodemailer from 'nodemailer';


async function sendMail(email, subject, text) {
    console.log('GmailserviceAppKode:', process.env.GmailserviceAppKode);
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

    console.log("E-mail sendt! ID:", info.messageId);
}

export default sendMail;