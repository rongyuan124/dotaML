var io;

function emitToClient(matchId,prediction){
    var data = {
        matchId : matchId,
        prediction: prediction
    };
    io.emit('match',data);
}

module.exports = function(server) {
    io = require('socket.io').listen(server);
    io.on('connection',function(socket){
        console.log(matchId+' joined room');
        var matchId = socket.matchId;
        socket.join(matchId);
    })
}

module.exports.emitToClient = emitToClient;