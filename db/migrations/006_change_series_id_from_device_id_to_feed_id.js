/**
 * Created by pengwei on 6/24/15.
 */
var config = require('../../config').config;
var mongoUrl = config.env=='production' ? mongoUrl = config.mongodb.cloudMongo : config.mongodb.devMongo;
var mongoose = require('mongoose');
var Device = require('../../models/Device');
var Driver = require('../../models/Driver');
var pg = require('pg');
var conString = (config.env =='production') ? config.postgres.cloud : config.postgres.local;

mongoose.connect(mongoUrl);

Device.find({})
    .exec(function(err, devices){
        devices.forEach(function(device){
            if(device.feeds && device.feeds['GPIO Thermocouple']){
                var deviceId = device._id.toString();
                var feedId = device.feeds['GPIO Thermocouple']['temperature'].feedId;
                var pgClient = new pg.Client(conString);
                pgClient.connect(function (err) {
                    if (err) console.log('pgerr ', err);
                    pgClient.query('UPDATE sensor SET series_id = $1 WHERE series_id = $2', [feedId, deviceId], function (err, result) {
                        if (err) console.log('pgerr ', err);
                        pgClient.end();
                    });
                });
            }
        });
    });