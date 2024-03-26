import http from 'http';
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { port } from '../config.js';
import myIo from './sockets/io.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { routes } from './routes/routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = resolve(__dirname, '../client/public'); // this leads to the public directory 
                                                              // where inside there there is a js direcotry 
                                                              // and inside there is the index.js file

server.listen(port);

export let games = {};

myIo(io);

console.log(`Server listening on port ${port}`);


const Handlebars = handlebars.create({
  extname: '.html', 
  partialsDir: path.join(__dirname, '..', 'client', 'views', 'partials'), 
  defaultLayout: false,
  helpers: {}
});



app.engine('html', Handlebars.engine);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'client', 'views'));
app.use('/public', express.static(publicPath));


routes(app);