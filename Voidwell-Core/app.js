var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');

var logger = require('./logger')('VoidwellCoreHTTP');
var config = require('./config');

require('./database');
require('./rediscache');

var controllers = requireDir('./controllers');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

app.use(function (req, res, next) {
    logger.debug(req.method, req.url);
    next();
});

app.use(function (req, res, next) {
    req.start = new Date();
    res._json = res.json;
    
    res.json = function (result) {
        var response = {};
        
        if (result instanceof Error) {
            response.success = false;
            response.message = result;
        } else {
            response.success = true;
            if (result !== undefined) {
                response.data = result;
            }
        }
        
        response.duration = new Date() - req.start;
        
        return res._json(response);
    }
    
    next();
});

app.post('/:controller/:method', function (req, res, next) {
    var controller = req.params.controller;
    var method = req.params.method;
    var args = req.body.args || [];
    
    var encodedArgs = [];
    args.forEach(function (arg) {
        if (arg === 'null') {
            encodedArgs.push(null);
        } else {
            encodedArgs.push(arg);
        }
    });
        
    try {
        controllers[controller][method](...encodedArgs, req, res, next);
    } catch(ex) {
        logger.log(ex);
        res.json(new Error('Critical failure in controller: ' + controller + '-' + method));
    }
});

app.listen(config.port, function () {
    logger.log('Listening on port ' + config.port);
});