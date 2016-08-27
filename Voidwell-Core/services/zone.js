var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('zone').then(function (record) {
    if (record) {
        var diff = new Date() - record.lastUpdate;
        if (diff > updateDelay) {
            refresh();
        } else {
            updateTimeout = setTimeout(refresh, diff);
        }
    } else {
        refresh();
    }
});

module.exports.refresh = refresh;

module.exports.getAllZones = function (callback) {
    var options = {
        where: {
            id: {
                $lt: 90
            }
        }
    };

    db.Zone.findAll(options)
    .then(function (zones) {
        var jsonData = zones.map(function (d) {
            return d.toJSON();
        });
        callback(null, jsonData);
    })
    .catch(function (error) {
        callback(error);
    });
};

function refresh(callback) {
    console.log('Updating zone');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: zone, ', error);
            }
            console.log('Update complete: zone');
        };
    }

    census.zone.getAllZones(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.zone_id,
                code: d.code,
                name: d.name ? d.name.en : null,
                hexSize: d.hex_size,
                description: d.description ? d.description.en : null
            };
        });
        
        db.Zone.bulkCreate(records, {
            updateOnDuplicate: ['code', 'name', 'hexSize', 'description']
        }).then(function () {
            db.UpdateHistory.upsert({
                id: 'zone',
                lastUpdate: new Date()
            });
            
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(refresh, updateDelay);
            
            callback();
        }).catch(function (error) {
            callback(error);
        });
    });
}