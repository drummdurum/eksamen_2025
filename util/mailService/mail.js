const nodemailer = require('nodemailer');

async function sendMail() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sedrumm@gmail.com',
            pass: 'lzfa sepz infy lafa' // Brug app-koden her
        }
    });

    let info = await transporter.sendMail({
        from: '"Dit Navn" <dinemail@gmail.com>',
        to: "modtager@example.com",
        subject: "Test fra Nodemailer",
        text: "Hej! Dette er en test-e-mail sendt fra Node.js med Gmail."
    });

    console.log("E-mail sendt! ID:", info.messageId);
}

sendMail().catch(console.error);
