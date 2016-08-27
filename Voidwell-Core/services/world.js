var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('world').then(function (record) {
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

module.exports.getAllWorlds = function (callback) {
    db.World.findAll()
    .then(function (worlds) {
        var jsonData = worlds.map(function (d) {
            return d.toJSON();
        });
        callback(null, jsonData);
    })
    .catch(function (error) {
        callback(error);
    });
};

function refresh(callback) {
    console.log('Updating world');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: world, ', error);
            }
            console.log('Update complete: world');
        };
    }

    census.world.getAllWorlds(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.world_id,
                name: d.name ? d.name.en : null
            };
        });
        
        db.World.bulkCreate(records, {
            updateOnDuplicate: ['name']
        }).then(function () {
            db.UpdateHistory.upsert({
                id: 'world',
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