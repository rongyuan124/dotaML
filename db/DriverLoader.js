var fs = require('fs');
var os = require('os');
var config = require('../config').config;
var mongoUrl = config.mongodb.devMongo;
if(config.env=='production'){
    mongoUrl = config.mongodb.cloudMongo;
}

// db modules
var mongoose = require('mongoose');
// seed data
// var seedDriver = require('../db/seedDriver').seedDriver;
var Driver = require('../models/Driver.js');

mongoose.connect(mongoUrl);

var driverPath = __dirname + '/../../Tetrascience_device/app_control/templates';

Driver.remove({}, function(err) {
  var driverFiles = fs.readdirSync(driverPath);
  var count = 0;
  for (var i=0, l=driverFiles.length; i<l; i++) {
    var path = driverPath + '/' + driverFiles[i];
    if (!fs.statSync(path).isDirectory()) {
      console.log(path);
      // driver file should create template variable
      eval(fs.readFileSync(path, encoding='utf8'));
      Driver.create(template, function(err, driver) {
        if (err) return console.error(err);
        count++;
        if (count === l) {
          process.exit();
        }
      });
    } else {
      count++;
    }
  }
});
