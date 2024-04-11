let gameHasStarted = false;
var board = null;
let socket = io();
var game = new Chess();
var $status = $('#status');
var $statusMob = $('#statusMob');
var $pgn = $('#pgn-container');
var $pgnMobile = $('#pgn-mobile');
var $bruhSound = $('#bruhSound');
var $checkSound = $('#checkSound'); 
var $checkMateSound = $('#checkMateSound'); 
var $drawSound = $('#drawSound');
var $rizzSound = $('#rizzSound');
var $fartSound = $('#fartSound');
let gameOver = false;
let moveCount = 1;
let turnCount = 0;
let colorWhoResigned = '';
let colorWhoRequestedDraw = '';

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;
    if (!gameHasStarted) return false;
    if (gameOver) return false;

    if ((playerColor === 'black' && piece.search(/^w/) !== -1) || (playerColor === 'white' && piece.search(/^b/) !== -1)) {
        return false;
    }

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

// this gets called when you make a move
function onDrop (source, target) {
    let theMove = {
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for simplicity
    };

    // see if the move is legal
    var move = game.move(theMove);

    // illegal move
    if (move === null) return 'snapback';

    socket.emit('move', theMove);
    updateStatus();       
}

// this gets called when the oponent makes a move
socket.on('newMove', function(move) {
    game.move(move);
    board.position(game.fen());
    updateStatus();
    playGameSounds(game);
    updatePgn();
});

function playGameSounds(game){
    if ((game.in_checkmate())) {
        $checkMateSound.get(0).play();
    }       
    else if(game.in_check()){
        $checkSound.get(0).play();
    }
    else if (game.in_draw()) {
        $drawSound.get(0).play();
    }
    else {
        $bruhSound.get(0).play();
    }             
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen());
    // $('#pgn').scrollTop($('#pgn').prop('scrollHeight'));
}

function updateStatus () {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position';
    }

    else if (gameOver) {
        status = 'Opponent disconnected, you win!';
    }

    else if (!gameHasStarted) {
        status = 'Waiting for black to join';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }         
    } 
    
    $status.html(status);
    $statusMob.html(status);
}


function updatePgn() {
    $pgnMobile.html(game.pgn());

    if (gameHasStarted) {                                                                
        if (game.pgn()) {                
            turnCount += 0.5;
            if (turnCount === 1) {
                turnCount = 0;
                let moveDiv = document.querySelector(`.move${moveCount}`);
                moveDiv.innerHTML =`${moveCount}. ` +  game.pgn().split('.')[moveCount];
                moveCount++;
            }
            else {
                $pgn.append('<div class="move' + moveCount + '">'+ moveCount + ". " + game.pgn().split('.')[moveCount] + '</div>');                                                                                                                 
            }            
        }                     
    }
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: '/public/img/chesspieces/wikipedia/{piece}.png'
}

board = Chessboard('myBoard', config)
if (playerColor == 'black') {
    board.flip();
}

updateStatus();

var urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('code')) {
    socket.emit('joinGame', {
        code: urlParams.get('code')
    });
}

socket.on('startGame', function() {
    gameHasStarted = true;
    updateStatus();
});

socket.on('gameOverDisconnect', function() {
    gameOver = true;
    updateStatus();
});

socket.on('drawRequest', function() {
    if (colorWhoRequestedDraw === '') {
        toastr.info(
            `Your opponent has offered a draw`, 
            "Draw request",
            {
                timeOut: 10000,
                extendedTimeOut: 0, 
                progressBar: true,
                closeButton: true, 
                positionClass: "toast-bottom-left", 
                tapToDismiss: false,
                preventDuplicates: true,
                closeHtml: `<button onclick="acceptDraw()">Accept</button>` +
                            `<br />` +
                            `<button onclick="rejectDraw()">Reject</button>`
            }
        );
    }
});

window.acceptDraw = () => {
    socket.emit('draw');       
}

window.rejectDraw = () => {
    socket.emit('drawReject');
}

socket.on('drawReject', function() {
    if (colorWhoRequestedDraw !== '') {
        colorWhoRequestedDraw = '';
        toastr.error(
            `Your opponent has declined your draw offer`, 
            "Draw offer rejected",
            {
                timeOut: 3000,
                extendedTimeOut: 0, 
                closeButton: true, 
                positionClass: "toast-bottom-left", 
                tapToDismiss: false,
                preventDuplicates: true,              
            }
        );
    }
});


socket.on('draw', function() {
    $status.html(`Draw!`);
    $statusMob.html(`Draw!`);
    gameOver = true;
    $drawSound.get(0).play();
});

socket.on('resign', function() {
    if (colorWhoResigned === '') {
        $status.html(`Your opponent has resigned, game over!`);
        $statusMob.html(`Your opponent has resigned, game over!`);
        $rizzSound.get(0).play();
    } 
    else {
        $status.html(`You have resigned, game over!`);
        $statusMob.html(`You have resigned, game over!`);
        $fartSound.get(0).play();
    } 
    colorWhoResigned = '';
    gameOver = true;
});


function handleResign() {
    if (gameHasStarted && !gameOver){
        colorWhoResigned = playerColor;
        socket.emit('resign');
    } 
}

function handleDraw() {
    if (gameHasStarted && !gameOver) {
        colorWhoRequestedDraw = playerColor;
        socket.emit('drawRequest');

        toastr.success(
            `A draw offer was sent to your opponent`, 
            "Draw offer",
            {
                timeOut: 3000,
                extendedTimeOut: 0, 
                closeButton: true, 
                positionClass: "toast-bottom-left", 
                tapToDismiss: false,
                preventDuplicates: true,              
            }
        );
    }
}


$('#resignBtn').on('click', handleResign);
$('#resignBtnMob').on('click', handleResign);
    

$('#drawBtn').on('click', handleDraw); 
$('#drawBtnMob').on('click', handleDraw);