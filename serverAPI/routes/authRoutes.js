import { Router } from 'express';
import { compare } from 'bcrypt';
import bcrypt from 'bcryptjs';
import db from './../../database/connection.js'; 
import {sendMail} from './../../util/mailService/sendMail.js';
import rateLimit from 'express-rate-limit'; 
const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  message: { message: 'For mange loginforsøg. Prøv igen om 15 minutter.' }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3, 
  message: { message: 'For mange oprettelser. Prøv igen senere.' }
});

router.get('/me', (req, res) => {
  console.log('/me endpoint debug:', {
    hasSession: !!req.session,
    hasUser: !!req.session?.user,
    sessionUser: req.session?.user,
    sessionId: req.sessionID
  });
  
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ user: null });
  }
});

router.get('/meInfo', async (req, res) => {
  // Robust userId retrieval
  let userId = req.session?.user?.userId;
  
  if (!userId && req.session?.user?.username) {
      try {
          const user = await db.get('SELECT id FROM users WHERE name = ?', [req.session.user.username]);
          userId = user?.id;
      } catch (err) {
          console.error('Error getting userId from username in /meInfo:', err);
      }
  }
  
  if (userId) {
    try {
      const user = await db.get(
        `SELECT id, name, email FROM users WHERE id = ?`,
        [userId]
      );
      if (user) {
        res.json({ user });
      } else {
        res.status(404).json({ user: null });
      }
    } catch (err) {
      res.status(500).json({ error: "Serverfejl" });
    }
  } else {
    res.status(401).json({ user: null });
  }
});


router.post('/loginSent', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    try {
    
        const user = await db.get(`
            SELECT * FROM users WHERE name = ?
        `, [username]);

        if (user) {
           
            const isPasswordValid = await compare(password, user.password);

            if (isPasswordValid) {
              
                req.session.user = {
                    username: user.name,
                    isAdmin: user.isAdmin,
                    userId: user.id,
                };

                console.log('Login successful, session created:', {
                    sessionId: req.sessionID,
                    sessionUser: req.session.user,
                    userId: user.id
                });

               
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
                
                res.status(401).send({ message: 'Unauthorized: Invalid credentials! forkert kdoe' });
            }
        } else {
            
            res.status(401).send({ message: 'Unauthorized: Invalid credentials! du findes ikke' });
        }
    } catch (error) {
        console.error('Fejl under login:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/logud', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Fejl under logout:', err);
            return res.status(500).send('Kunne ikke logge ud');
        }
        res.redirect('/login');
    });
});

router.post('/signup', signupLimiter, async (req, res) => {
    const { username, password, email } = req.body;

    if (username.length<4){
      res.send("not waild")
    }

    try {
        
        const existingUser = await db.get(`
            SELECT * FROM users WHERE name = ?
        `, [username]);

        const existingEmail = await db.get(`
            SELECT * FROM users WHERE email = ?
        `, [email]);

        if(existingEmail){
            return res.status(400).send({message: 'Email bliver allerede brugt'})
        }

        if (existingUser) {
            return res.status(400).send({ message: 'Brugernavnet er allerede taget' });
        }
       
       const saltRounds = 10;
       const hashedPassword = bcrypt.hashSync(password, saltRounds); 

      
       await db.run(`
           INSERT INTO users (name, email, password, isAdmin)
           VALUES (?, ?, ?, ?)
       `, [username, email, hashedPassword, 0]);
        
       req.session.user = {
        username: username,
        isAdmin: 0, 
    };
       res.status(201).send({ message: 'Du er nu oprettet og bliver sendt til forsiden' });
       sendMail(email, 'Velkommen til BarToBar', 'Tak fordi du tilmeldte dig BarToBar! Vi glæder os til at have dig med.');
        
    } catch (error) {
        console.error('Fejl under oprettelse af bruger:', error);
        res.status(500).send({ message: 'Intern serverfejl' });
    }
});

export default router;