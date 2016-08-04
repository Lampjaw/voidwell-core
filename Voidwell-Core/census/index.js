var requireDir = require('require-dir');
var dbgcensus = require('dbgcensus');

var serviceRoutes = requireDir('./services');

dbgcensus.SetGlobalNamespace('ps2');
dbgcensus.SetGlobalServiceKey('LampjawScraper');

var censusBase = {
    createQuery: function (serviceName) {
        return new dbgcensus.Query(serviceName);
    },
    fetchData: function (query, isList, callback) {
        query.get(function (error, data) {
            if (error) {
                return callback('[CensusService] Failed to retrieve data', error);
            }
            
            if (isList) {
                callback(null, data);
            } else {
                callback(null, data[0]);
            }
        });
    },
    fetchAllData: function (query, callback) {
        var count = 0;
        var items = [];
        
        var queryStr = query.toString();
        
        var postFn = function (error, data) {
            if (error) {
                return callback(error);
            }
            
            if (data.length === 0) {
                return callback(null, items);
            }
            
            items = items.concat(data);
            
            count += data.length;
            query.setStart(count);
            censusBase.fetchData(query, true, postFn);
        };
        
        query.setLimit(500);
        query.setStart(count);
        query.setLanguage('en');
        
        censusBase.fetchData(query, true, postFn);
    },
    convertDate: function (date) {
        var year = data.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var seconds = date.getSeconds();
        
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
    }
};

var services = {};

if (serviceRoutes) {
    Object.keys(serviceRoutes).forEach(function (route) {
        services[route] = require('./services/' + route)(censusBase);
    });
}

module.exports = services;