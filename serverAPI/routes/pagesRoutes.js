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
  const message = req.session?.message || null; // Hent beskeden fra sessionen, hvis den findes
  req.session.message = null; // Ryd beskeden efter brug
  res.send(loginPage.replace('{{message}}', message || '')); // Indsæt beskeden i HTML'en
});

import {adminpageNyBar} from '../../util/pages.js';

router.get('/addBar', adminMiddleware, async (req, res) => {
  res.send(adminpageNyBar);
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
export default router;

