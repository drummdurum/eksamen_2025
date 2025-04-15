import {Router} from 'express';
import {compare} from 'bcrypt';
const router = Router();

import testUsers from '../util/test/testUsers.js';

async function isAuthenticated(hashedPassword, password) {
    return await compare(password, hashedPassword);
}

router.post('/loginSent', async (req, res) => {
    const { username, password } = req.body;

    // Find brugeren i testUsers
    const user = testUsers.find((user) => user.username === username);

    if (user) {
        // Sammenlign den indtastede adgangskode med den hashed adgangskode
        const isPasswordValid = await compare(password, user.password);

        if (isPasswordValid) {
            // Hvis adgangskoden er korrekt
            if (user.isAdmin) {
                res.status(200).send({
                    message: 'Login successful! Welcome, Admin!',
                    isAdmin: true,
                });
            } else {
                res.status(200).send({
                    message: 'Login successful! Welcome, User!',
                    isAdmin: false,
                });
            }
        } else {
            // Hvis adgangskoden er forkert
            res.status(401).send({ message: 'Unauthorized: Invalid credentials!' });
        }
    } else {
        // Hvis brugeren ikke findes
        res.status(401).send({ message: 'Unauthorized: Invalid credentials!' });
    }
});

    export default router;