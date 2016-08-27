'use strict';

var fs = require("fs");
var path = require("path");
var Sequelize = require('sequelize');

var logger = require('./../logger')('VoidwellCore');
var config = require('./../config').database;

var modelPath = __dirname + '/models';
var db = {};

var sequelize = new Sequelize(config.schema, config.username, config.password, {
    host: config.host,
        
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
        dateStrings: false
    },
        
    logging: false,
        
    pool: {
        max: 250,
        min: 0,
        idle: 10000
    },
        
    define: {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    }
});

var modelFiles = fs.readdirSync(modelPath);
modelFiles.forEach(function (file) {
    var model = sequelize.import(path.join(modelPath, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (name) {
    if ("associate" in db[name]) {
        db[name].associate(db);
    }
});

sequelize.sync()
    .then(function () {
        logger.log('Sequelize sync complete');
    })
    .catch(function (error) {
        logger.log('Sequelize sync failed', error);
    });

module.exports = db;