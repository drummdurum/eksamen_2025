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

const resetPassPage = readPage('./public/pages/forgottenKode/resetPass.html')
export const resetPass = contructPage(resetPassPage, {title: 'Resset adgangkode'});

const profilePage = readPage('./public/pages/profilSide/profil.html')
export const profile = contructPage(profilePage, {title: 'Profil'});

const barInfopage = readPage('./public/pages/barInfo/barInfo.html')
export const barInfo = contructPage(barInfopage, {title: 'Bar Info'});

const makesRouterpage = readPage('./public/pages/makesRoutes/makesRoutes.html')
export const makesRouter = contructPage(makesRouterpage, {title: 'Lav rute'});

const temaPage = readPage('./public/pages/tema/tema.html')
export const tema = contructPage(temaPage, {title: 'Tema'});

const paymentPage = readPage('./public/pages/payment/payment.html')
export const payment = contructPage(paymentPage, {title: 'Betaling'});

const successPage = readPage('./public/pages/payment/succes.html')
export const success = contructPage(successPage, {title: 'Betaling gennemført'});

const errorPage = readPage('./public/pages/payment/cancel.html')
export const error = contructPage(errorPage, {title: 'Betaling fejlet'});



