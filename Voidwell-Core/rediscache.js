'use strict';

var redis = require('redis');

var config = require('./config').redis;

var client = redis.createClient(config);

client.on('error', function (error) {
    console.log('Redis error!', error);
});

client.on('reconnecting', function (result) {
    console.log('Redis attempting reconnect: attempt ' + result.attempt);
});

client.on('ready', function () {
    console.log('Redis connected');
});

module.exports = client;