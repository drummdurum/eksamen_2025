import Router from 'express';
import { generateResetToken } from './../../util/mailService/createTokens.js'; 
import { sendResetEmail, validateResetToken, updatePassword } from './../../util/mailService/restEmail.js'; 
import db from './../../database/connection.js'; 

const routes = Router();

routes.post('/sendMailForgottenKode', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'E-mail-adresse er påkrævet' });
    }

    try {
        const user = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.status(404).send({ message: 'Bruger ikke fundet' });
        }

        const token = await generateResetToken(user.id);

        await sendResetEmail(email, token);

        res.status(200).send({ message: 'Vi har sendt en E-mail til nulstilling af adgangskode, gå in på din mail og tryk på linket' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Kunne ikke sende nulstillings-e-mail' });
    }
});

routes.post('/updateNewPass', async (req, res) => {
    const {token, newPassWord} = req.body;

    if(!newPassWord){
        return res.status(404).send({ message:'Skriv nyt kodeord!'})
    }
    try {
        const tokenData = await validateResetToken(token);
        if (!tokenData) {
            return res.status(400).send({ message: 'Ugyldigt eller udløbet token' });
        }
        await updatePassword(tokenData.user_id, newPassWord);
        res.status(200).send({ message: 'Adgangskode nulstillet!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Kunne ikke nulstille adgangskode' });
    }

});


export default routes;  