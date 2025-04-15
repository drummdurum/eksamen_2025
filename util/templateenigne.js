import fs from 'fs';

export function readPage(path){
    return fs.readFileSync(path).toString();
}



const header = readPage('./public/pages/compentens/header/header.html');
const footer = readPage('./public/pages/compentens/footer/footer.html');


export function contructPage(pageHTML, options={}){
   const csslinks = `<link rel="stylesheet" href="${options.csslinks || '../../../pages/compentens/asset/css/loginForm.css'}">`;;

    return header
    .replace('$NAV-TITLE$', options.title || 'login')
    .replace('$CSS-LINKS$', csslinks || '' )
    + pageHTML 
    + footer;
}