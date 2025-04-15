import Routes from 'express';

const router = Routes();

import {frontpage} from '../util/pages.js';
import {loginPage} from '../util/pages.js';



router.get('/', async (req, res) => {
  res.send(frontpage);
});

router.get('/login', async (req, res) => {
  res.send(loginPage);
});

export default router;