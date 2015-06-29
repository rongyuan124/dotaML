/**
 * Created by pengwei on 6/15/15.
 */

var config = require('../../config').config;
var mongoUrl = config.env=='production' ? mongoUrl = config.mongodb.cloudMongo : config.mongodb.devMongo;
var mongoose = require('mongoose');
var Trigger = require('../../models/Trigger');

mongoose.connect(mongoUrl);

Trigger.find({})
    .exec(function(err, triggers){
        triggers.forEach(function(trigger){
            trigger.delay = trigger.toObject().waitDuration;
            trigger.set('waitDuration', undefined, {strict: false});
            trigger.save();
        });
    });