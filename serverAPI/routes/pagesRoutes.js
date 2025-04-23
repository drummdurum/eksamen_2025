import Routes from 'express';
import authMiddleware from '../middleware/authMiddelware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Routes();

import {frontpage} from '../../util/pages.js';

router.get('/', async (req, res) => {
  res.send(frontpage);
});

import {loginPage} from '../../util/pages.js';

router.get('/login', async (req, res) => {
  res.send(loginPage);
});

import {adminpageNyBar} from '../../util/pages.js';

router.get('/adminpageNewBar', adminMiddleware, async (req, res) => {
  res.send(adminpageNyBar);
});

router.get('/dashboard', authMiddleware, (req, res) => {
  res.send(`Velkommen til dashboardet, ${req.session.user.username}`);
});


export default router;