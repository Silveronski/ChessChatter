import { games } from '../server.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = resolve(__dirname, '../../client/views');

export const routes = app => {

    app.get('/', (req, res) => {
        const indexPath = path.join(viewsPath, 'index.html');
        res.sendFile(indexPath);
    });

    app.get('/white', (req, res) => {     
        res.render('game', {
            color: 'white'
        });
    });

    app.get('/black', (req, res) => {
        if (!games[req.query.code]) {
            return res.redirect('/?error=invalidCode');
        }
        
        res.render('game', {
            color: 'black'
        });
    });
};