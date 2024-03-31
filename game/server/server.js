import http from 'http';
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import myIo from './sockets/io.js';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { routes } from './routes/routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT  = 3037;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = resolve(__dirname, '../client/public'); 

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

export let games = {};

myIo(io);

const Handlebars = handlebars.create({
  extname: '.html', 
  defaultLayout: false,
  helpers: {}
});

app.engine('html', Handlebars.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'client', 'views'));
app.use('/public', express.static(publicPath));

routes(app);