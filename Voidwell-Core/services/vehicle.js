var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('vehicle').then(function (record) {
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

module.exports.getAllVehicles = function (callback) {
    var options = {
        include: {
            model: db.VehicleFaction,
            as: 'faction'
        }
    };

    db.Vehicle.findAll(options)
        .then(function (data) {
            var jsonData = data.map(function (d) {
                var jData = d.toJSON();
                jData.factions = jData.faction.map(function (f) { return f.factionId});
                delete jData.faction;
                return jData;
            });
        
            callback(null, jsonData);
        })
        .catch(function (error) {
            callback(error);
        });
};

function refresh(callback) {
    console.log('Updating vehicle');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: vehicle, ', error);
            }
            console.log('Update complete: vehicle');
        };
    }

    census.vehicle.getAllVehicles(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.vehicle_id,
                name: d.name ? d.name.en : null,
                description: d.description ? d.description.en : null,
                cost: d.cost,
                costResourceId: d.cost_resource_id,
                imageId: d.image_id
            };
        });
        
        db.Vehicle.bulkCreate(records, {
            updateOnDuplicate: ['name', 'description', 'cost', 'costResourceId', 'imageId']
        }).then(function () {
            census.vehicle.getAllVehicleFactions(function (error, data) {
                if (error) {
                    return callback(error);
                }
                
                if (data === undefined) {
                    return callback(null);
                }
                
                var records = data.map(function (d) {
                    return {
                        vehicleId: d.vehicle_id,
                        factionId: d.faction_id
                    };
                });
                
                db.VehicleFaction.bulkCreate(records, {
                    ignoreDuplicates: true
                }).then(function () {
                    db.UpdateHistory.upsert({
                        id: 'vehicle',
                        lastUpdate: new Date()
                    });
                    
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(refresh, updateDelay);
                    
                    callback();
                }).catch(function (error) {
                    callback(error);
                });
            });
        }).catch(function (error) {
            callback(error);
        });
    });
}