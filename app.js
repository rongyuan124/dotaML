require("console-stamp")(console, 'isoDateTime');
var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var passport       = require('passport');
var expressSession = require('express-session');
var mongoStore     = require('connect-mongo')(expressSession);
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var flash          = require('connect-flash');
var multer         = require('multer');
var debug          = require('debug')('app');
var http           = require('http');
var fs             = require('fs');
var moment         = require('moment');
var superagent     = require('superagent');

//config variables
var config = require('./config').config;
var env    = config.env;
var port   = config.express.port;


// disable console log in production
// enable console.log if process.env.NODE_ENV = production
if (env == 'production'){
    console.log = function(){};
}


// aws
var AWS = require('aws-sdk');

// create app and server
var app = express();
var server = http.createServer(app);

io = require('socket.io').listen(server);

// app settings and middlewares
app.enable('trust proxy'); // such that express can see req.info as the proxy
app.set('port', port);
app.set('env',env);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable("x-powered-by"); // prevent profiling the webserver

// Object responsible for interfacing with SP
var SpManager = (function(){
    var key = '7994766109F00F8528BF6668AA0120C1'
    return {
        getMatch: function (matchId,cb) {
            superagent.get('https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=27110133&key=7994766109F00F8528BF6668AA0120C1')
                .end(cb);
        }
    }
})();

var getHeroIdinMatch = function(matchObj){
    var heroIdList = matchObj.result.players.map(function(player){
        return player.hero_id;
    });
    console.log(heroIdList);
    return heroIdList;
}



app.get('/',function(req,res){
    fs.createReadStream(__dirname + '/public/views/dashboard.html').pipe(res);
});

app.get('/match/:matchId',function(req,res,next){
    console.log(req.params.matchId);
    var matchId = req.params.matchId;
    SpManager.getMatch(matchId,function(err,resp){
        if (err) {next(err)}
        else {
            var heroIdList = getHeroIdinMatch(resp.body);
            res.send(heroIdList);
        }
    });
});



// generic server configuration
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    var errorPage = err.status == 404 ? '/public/views/404.html' : '/public/views/500.html';

    res.status(err.status || 500);
    console.error(err.message, err.stack);

    // report server error
    //utils.sendServerError(err,'Server Error',function(){});

    res.format({
        text : function(){
            res.send(err.message);
        },

        json: function(){
            res.send(err);
        },

        html : function(){
            fs.createReadStream(__dirname + errorPage).pipe(res);
        }
    });

});



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/* Event listener for HTTP server "error" event. */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/* Event listener for HTTP server "listening" event. */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('ts cloud server running on',port);
}

/* Uncaught exception handler */
// log the stack trace and log to loggly
// then close the server and end the process gracefully
process.on('uncaughtException',function(err){
    console.error('SEVER CRASH', err.message, err.stack);
    //utils.sendServerError(err,'Server Crash',function(){}); // send report email to developers
    server.close(); // close the server
    setTimeout(process.exit, 2000, 1); // restart the program
});
