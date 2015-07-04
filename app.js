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
var cp             = require('child_process');
var log            = require('loglevel');



//config variables
var config = require('./config').config;
var env    = config.env;
var port   = config.express.port;


// disable console log in production
// enable console.log if process.env.NODE_ENV = production
if (env == 'production'){
    console.log = function(){};
}

// mongodb database
var dbURL = (env =='production') ? config.mongodb.cloudMongo : config.mongodb.devMongo;
var db = mongoose.connect(dbURL);

// mongodb model
var Match = require('./models/Match.js');

// aws
//var AWS = require('aws-sdk');

// create app and server
var app = express();
var server = http.createServer(app);

require('./socketManager')(server);
var emitToClient = require('./socketManager').emitToClient;
console.log(emitToClient);

// app settings and middlewares
app.enable('trust proxy'); // such that express can see req.info as the proxy
app.set('port', port);
app.set('env',env);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable("x-powered-by"); // prevent profiling the webserver

// Object responsible for interfacing with SP
var SpManager = (function(){
    var key = '7994766109F00F8528BF6668AA0120C1';
    var url = 'https://api.steampowered.com/IDOTA2Match_570/getliveleaguegames/V001/?key=7994766109F00F8528BF6668AA0120C1';
    var queryInterval = 10*1000; // query the steam powered server every certain amount of time
    function getValidMatches(result){
        var validMatches = [];
        if (result.games) {
            result.games.forEach(function (game) {
                // there is no team information when the picks are ready
                var match = {};
                // todo: if duration > interval, the match should already have been properly saved
                // get the pick information
                if (game.scoreboard && game.scoreboard.radiant && game.scoreboard.dire
                    && game.scoreboard.radiant.picks && game.scoreboard.radiant.bans
                    && game.scoreboard.dire.picks && game.scoreboard.dire.bans) {

                    if (game.scoreboard.dire.picks.length == 5 &&
                        game.scoreboard.dire.bans.length == 5 &&
                        game.scoreboard.radiant.picks.length == 5 &&
                        game.scoreboard.radiant.bans.length == 5) {

                        match._id = game.match_id;
                        match.radiant_picks = game.scoreboard.radiant.picks;
                        match.dire_picks = game.scoreboard.dire.picks;
                    }
                }

                // get the team information
                if (game.radiant_team && game.dire_team) {
                    match._id = game.match_id;
                    match.radiant_team = game.radiant_team;
                    match.dire_team = game.dire_team;
                }

                // add to the list
                if (match._id) validMatches.push(match);
            });
        }
        return validMatches;
    };

    return {
        getOneMatch: function (matchId,cb) {
            superagent.get('https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id='+ matchId+ '&key='+key)
                .end(cb);
        },
        getCurrentMatches : function(cb){
            superagent.get(url)
                .end(cb);
        },

        getValidMatches : getValidMatches,

        run : function(){
            var self = this;
            setInterval(function(){

                self.getCurrentMatches(function(err,resp){
                    if (err) {console.error(err); return;}
                    console.log('------new query-------');
                    var result = resp.body.result;
                    if (!result || result.error) {
                        console.error(result.error); return;
                    }
                    var validMatches = getValidMatches(result);
                    console.log(validMatches.length);

                    validMatches.forEach(function(match){

                        Match.findById(match._id,function(err,m){
                            if (err) {console.error(err); return;}
                            // save to db

                            if (m) { // if the match exists in db
                                // update the match
                                m.radiant_picks = match.radiant_picks;
                                m.dire_picks = match.dire_picks;
                                if (match.radiant_team) {m.radiant_team = match.radiant_team}
                                if (match.dire_team) {m.dire_team = match.dire_team}
                                // save the match
                                m.save(function(err){
                                    if(err){console.error(err);return;}
                                    console.log('match udpated');

                                })
                            } else { // no prior match, save a new one
                                Match.create(match,function(err,createdMatch){
                                    if(err){console.error(err);return;}
                                    console.log('match saved');
                                })
                            }

                            // send to client

                            if (match.radiant_picks) match.radiant_picks = match.radiant_picks.map(function(pick){ return pick.hero_id});
                            if (match.dire_picks)    match.dire_picks = match.dire_picks.map(function(pick){return pick.hero_id});
                            emitToClient('match',match);

                            if (match.radiant_picks && match.dire_picks) {

                                cp.execFile(path.join(__dirname, 'dummy.py'), function (err, stdout, stderr) {
                                    if (err) {
                                        console.error(err); return;
                                    }
                                    console.log('Prediction is', stdout);
                                    var prediction = stdout;
                                    emitToClient('matchPrediction', {
                                        prediction:prediction,
                                        _id : match._id
                                    });
                                });
                            }




                        });

                    })
                })
            }, queryInterval)
        }
    }
})();

// debug
//var sampleObj = require('./sampleObj');
//var validMatches = SpManager.getValidMatches(sampleObj.result);
//console.log(validMatches.length);

// Start the query service
SpManager.run();

var getHeroIdinMatch = function(matchObj){
    var heroIdList = matchObj.result.players.map(function(player){
        return player.hero_id;
    });
    console.log(heroIdList);
    return heroIdList;
}

// create the input to the ml script
var createArray = function(heroIdList){
    var size = 110;
    var resultArray =  Array.apply(null, Array(size*2)).map(Number.prototype.valueOf,0);
    //console.log(resultArray);
    heroIdList.forEach(function(heroId,index){
        if (index>4) {
            resultArray[ heroId - 1 + size ] = 1; // team 2 has higher index in the array
        } else {
            resultArray[ heroId -1 ] = 1;
        }
    });
    return resultArray;
};

var dummyHeroIdList = [45,16,6,74,8,10,58,7,14,62];
cp.execFile(path.join(__dirname,'dummy.py'),function(err,stdout,stderr){
    if(err) {return console.error(err)}
    console.log('Prediction is',stdout);
});



app.get('/',function(req,res){
    fs.createReadStream(__dirname + '/public/views/dashboard.html').pipe(res);
});

// get all available matches
app.get('/matches',function(req,res){
    Match.find({},function(err,matches){
        if (err) {console.error(err);return;}
        if (matches) {
            matches = matches.map(function (match) {

                if (match.radiant_picks) match.radiant_picks = match.radiant_picks.map(function (pick) {
                    return pick.hero_id
                });
                if (match.dire_picks)    match.dire_picks = match.dire_picks.map(function (pick) {
                    return pick.hero_id
                });
                return match;
            });

            res.send(JSON.stringify(matches));
        } else {
            res.status(200).send({});
        }
    })
})

app.get('/match/:matchId',function(req,res,next){
    console.log(req.params.matchId);
    var matchId = req.params.matchId;
    SpManager.getOneMatch(matchId,function(err,resp){
        if (err) {next(err)}
        else {
            var match = resp.body;
            //console.log(match);
            if (match && match.result && match.result.players) {
                var heroIdList = getHeroIdinMatch(resp.body);
                var inputArray = createArray(heroIdList);

                // exec cp, should use queue
                cp.execFile(path.join(__dirname, 'dummy.py'), function (err, stdout, stderr) {
                    if (err) {
                        return console.error(err)
                    }
                    console.log('Prediction is', stdout);
                    var prediction = stdout;
                    emitToClient(matchId, prediction)
                });


                // send the http response back
                res.send({
                    matchId: matchId,
                    heroIdList: heroIdList
                });
            } else {
                var message;
                if (!match.result) {
                    message = 'No match result';
                } else if (!match.result.players){
                    message = 'No players info';
                }
                res.send({
                    matchId: matchId,
                    error: true,
                    message : message || match.result.error || 'Error getting match info'
                });
            }
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
