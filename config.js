var config = {};

var env = process.env.NODE_ENV || 'local'; //webstorm is not able to read the environment variables
                                                 //you may edit the configuration under RUN button
console.log('env:', env);

var mongodbObj = {
    devMongo : 'mongodb://@localhost:27017/dotaML',
    cloudMongo : process.env.CLOUD_MONGO
};

var expressObj = {
    port : process.env.PORT || 3003,
    sessionSecret : 'dota'
};


config.express = expressObj;
config.env = env;
config.mongodb = mongodbObj;

module.exports.config = config;

