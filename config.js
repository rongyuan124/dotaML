var config = {};

var env = process.env.NODE_ENV || 'local'; //webstorm is not able to read the environment variables
                                                 //you may edit the configuration under RUN button
console.log('env:', env);

var expressObj = {
    port : process.env.PORT || 3003,
    sessionSecret : 'dota'
};


config.express = expressObj;
config.env = env;

module.exports.config = config;

