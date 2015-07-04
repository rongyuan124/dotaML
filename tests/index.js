/**
 * Created by spin on 7/3/15.
 */
/*
 Testing script
 - data base is cleared every time before the run
 - data base is NOT cleared after  the run
 - can be used as the seeding script to prepare for demo
 */

var fs = require('fs');
var ini = require('ini');
var AWS = require('aws-sdk');
var argv = require('minimist')(process.argv.slice(2));

var config = require('../config').config;

var env = config.env;

//var url = config.baseURLMapping.local;
var mongoUrl = config.mongodb.devMongo;
if(env=='production') {
    mongoUrl = config.mongodb.cloudMongo;
}

//console.log(url);
console.log(mongoUrl);

// Testing modules
var superagent = require('superagent');
var expect = require('expect.js');

// db modules
var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var dbUrl = process.env.MONGOHQ_URL || mongoUrl;
var clearDB = require('mocha-mongoose')(dbUrl,{noClear:true});


if(config.env != 'local' && !argv.f){
    console.log('You are not on a local environment.  If you are SURE you want to clear the mongo db, run `mocha tests/index.js -R spec --f`');
    process.exit();
}


describe('dotaML',function(){




    // Connect to db
    before(function(done){
        if (mongoose.connection.db) return done();
        mongoose.connect(dbUrl,done);
    });

    // clearDB
    before(function(done){
        clearDB(function(err){
            console.log(err);
            done();
        });
    });

    it('dummy test, db cleared',function(done){
        done();
    })


});

