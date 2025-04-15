import {contructPage, readPage} from '../util/templateenigne.js';

const frontpagepage= readPage('./public/pages/frontpage/frontpage.html');
export const frontpage = contructPage(frontpagepage, {title: 'Find a bar!'});

const loginPagePage = readPage('./public/pages/login/login.html');
export const loginPage = contructPage(loginPagePage, {title: 'Login'});



