'use strict';

var fs = require("fs");
var path = require("path");
var Sequelize = require('sequelize');

var db = {};

module.exports.init = function (schema, username, password, host, callback) {
    var sequelize = new Sequelize(schema, username, password, {
        host: host,
        
        dialect: 'mysql',
        dialectOptions: {
            supportBigNumbers: true,
            bigNumberStrings: true,
            dateStrings: false
        },
        
        logging: false,
        
        pool: {
            max: 500,
            min: 0,
            idle: 10000
        },
        
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true
        }
    });
        
    fs
      .readdirSync(__dirname)
      .filter(function (file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
      .forEach(function (file) {
            var model = sequelize.import(path.join(__dirname, file));
            db[model.name] = model;
        });
    
    Object.keys(db).forEach(function (modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });
    
    module.exports.models = db;

    sequelize.sync()
    .then(function () {
        callback();
    })
    .catch(function (error) {
        callback(error);
    });
}