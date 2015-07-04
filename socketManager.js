var io;

function emitToClient(msg, matchObj){

    io.emit(msg,matchObj);
};

module.exports = function(server) {
    io = require('socket.io').listen(server);
    io.on('connection',function(socket){
        console.log(matchId+' joined room');
        var matchId = socket.matchId;
        socket.join(matchId);
    })
}

module.exports.emitToClient = emitToClient;