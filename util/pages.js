import {contructPage, readPage} from '../util/templateenigne.js';

const frontpagepage= readPage('./public/pages/frontpage/frontpage.html');
export const frontpage = contructPage(frontpagepage, {title: 'Find a bar!'});

const loginPagePage = readPage('./public/pages/login/login.html');
export const loginPage = contructPage(loginPagePage, {title: 'Login'});

const adminpageNyBarPage = readPage('./public/pages/addBar/newBar.html');
export const adminpageNyBar = contructPage(adminpageNyBarPage, {title: 'Admin - Ny Bar'});

const allBarsPage = readPage('./public/pages/allBar/allBar.html');
export const allBars = contructPage(allBarsPage, {title: 'All Bars'});

const forgottenKodesPage = readPage('./public/pages/forgottenKode/forgottenKode.html');
export const forgottenKodes = contructPage(forgottenKodesPage, {title: 'Glemt kode'});

