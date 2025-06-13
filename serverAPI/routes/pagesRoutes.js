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
  const message = req.session?.message || null; 
  req.session.message = null; 
  res.send(loginPage.replace('{{message}}', message || '')); 
});

import {allBars} from '../../util/pages.js';
router.get('/allBar', async (req, res) => {
  res.send(allBars);
});

import {forgottenKodes} from '../../util/pages.js';
router.get('/forgottenKode', async (req, res) => {
  res.send(forgottenKodes);
});

import {resetPass} from '../../util/pages.js';
router.get('/reset-password', async (req, res) =>{
  res.send(resetPass)
});

import {profile} from '../../util/pages.js';
router.get('/profile', authMiddleware, async (req, res) => {
  res.send(profile); 
});

import {barInfo} from '../../util/pages.js';
router.get('/barInfo', async (req, res) => {
  res.send(barInfo); 
});

import {makesRouter} from '../../util/pages.js';
router.get('/makesRoutes', async (req, res) => {
  res.send(makesRouter); 
});

import {tema} from '../../util/pages.js';
router.get('/tema', async (req, res) => {
  res.send(tema); 
});

import {payment} from '../../util/pages.js';
router.get('/payment', authMiddleware, async (req, res) => {
  res.send(payment); 
});

import {success} from '../../util/pages.js';
router.get('/success', async (req, res) => {
  res.send(success); 
});

import {error} from '../../util/pages.js';
router.get('/cancel', async (req, res) => {
  res.send(error); 
});

import {orders} from '../../util/pages.js';
router.get('/orders', adminMiddleware, async (req, res) => {
  res.send(orders); 
});

export default router;

