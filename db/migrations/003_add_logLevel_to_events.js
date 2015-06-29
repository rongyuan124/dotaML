/**
 * Created by pengwei on 6/23/15.
 */

var config = require('../../config').config;
var mongoUrl = config.env=='production' ? mongoUrl = config.mongodb.cloudMongo : config.mongodb.devMongo;
var mongoose = require('mongoose');
var Event = require('../../models/Event');

mongoose.connect(mongoUrl);

Event.find({})
    .exec(function(err, events){
        events.forEach(function(event){
            if(event.eventType == 'data') {
                event.logLevel = 'data';
            }else{
                event.logLevel = 'msg';
            }
            event.save();
        });
    });