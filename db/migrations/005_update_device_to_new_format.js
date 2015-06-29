/**
 * Created by pengwei on 6/23/15.
 */

var config = require('../../config').config;
var mongoUrl = config.env=='production' ? mongoUrl = config.mongodb.cloudMongo : config.mongodb.devMongo;
var mongoose = require('mongoose');
var Device = require('../../models/Device');
var Driver = require('../../models/Driver');

var defaultDriver = config.box.defaultDriver;
mongoose.connect(mongoUrl);

Device.find({})
    .exec(function(err, devices){
        devices.forEach(function(device){
            device.alerts = {
                online: {
                    enabled: true
                },
                offline: {
                    enabled: true,
                    delay: 1800
                }
            };

            device.set('sensor', undefined, {strict: false});
            device.set('adaptor', undefined, {strict: false});
            device.set('camera', undefined, {strict: false});
            device.set('tsswitch', undefined, {strict: false});
            device.set('trigger', undefined, {strict: false});


            device.updateDriver(defaultDriver[device.deviceType]);
        });
    });