var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');

var db = require('./models');
var config = require('./config');

db.init(config.schema, config.username, config.password, config.host, function (error) {
    if (error) {
        console.log(error);
        return;
    }
    console.log('[SERVER] Voidwell-Core initialized');
});

var services = {};

var serviceRoutes = requireDir('./services');
if (serviceRoutes) {
    Object.keys(serviceRoutes).forEach(function (route) {
        services[route] = require('./services/' + route);
    });
}

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

app.use(function (req, res, next) {
    req.start = new Date();
    res._json = res.json;
    
    res.json = function (data, isError) {
        var response = {};
        
        if (isError) {
            response.success = false;
            response.message = data;
        } else {
            response.success = true;
            if (data !== undefined) {
                response.data = data;
            }
        }
        
        response.duration = new Date() - req.start;
        
        return res._json(response);
    }
    
    next();
});

app.post('/:service/:method', function (req, res, next) {
    var service = req.params.service;
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
    
    var callback = function (error, data) {
        if (error) {
            return next(error);
        }
        
        res.json(data);
    };
            
    services[service][method](...encodedArgs, callback);
});

app.listen(config.port, function () {
    console.log('[SERVER] Listening on port ' + config.port);
});