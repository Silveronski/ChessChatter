import { games } from '../server.js';

const myIo = (io) => {
    io.on('connection', socket => {

        console.log('New socket connection');
        let currentCode = null;

        socket.on('move', function(move) {          
            io.to(currentCode).emit('newMove', move);
        });
        
        socket.on('joinGame', function(data) {
            currentCode = data.code;
            socket.join(currentCode);
            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }
            
            io.to(currentCode).emit('startGame');
        });

        socket.on('drawRequest', function() {
            if (currentCode) {
                io.to(currentCode).emit('drawRequest');
            }
        });

        socket.on('drawReject', function() {
            if (currentCode) {
                io.to(currentCode).emit('drawReject');
            }
        });

        socket.on('draw', function() {
            if (currentCode) {
                io.to(currentCode).emit('draw');
                delete games[currentCode];
            }
        });

        socket.on('resign', function() {
            if (currentCode) {
                io.to(currentCode).emit('resign');
                delete games[currentCode];
            }
        });

        socket.on('disconnect', function() {
            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }
        });
    });   
};

export default myIo;