var async = require('async');

var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('map').then(function (record) {
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

module.exports.getMapOwnership = function (worldId, zoneId, callback) {
    census.map.getMapOwnership(worldId, zoneId, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        var map = data.Regions.Row.map(function (r) {
            return {
                regionId: Number(r.RowData.RegionId),
                factionId: Number(r.RowData.FactionId)
            };
        });
        
        callback(null, map);
    });
};

module.exports.getMapRegions = function (zoneId, callback) {
    db.MapRegion.findAll({ where: { zoneId: zoneId } })
    .then(function (data) {
        var jsonData = data.map(function (d) {
            return d.toJSON();
        });
        callback(null, jsonData);
    })
    .catch(function (error) {
        callback(error);
    });
};
    
module.exports.getFacilityLinks = function (zoneId, callback) {
    db.FacilityLink.findAll({ where: { zoneId: zoneId } })
    .then(function (data) {
        var jsonData = data.map(function (d) {
            return d.toJSON();
        });
        callback(null, jsonData);
    })
    .catch(function (error) {
        callback(error);
    });
};

module.exports.findRegions = function (facilityIds, callback) {    
    var options = {
        where: {
            facilityId: facilityIds
        },
        attributes: ['facilityId', 'facilityName', 'facilityType']
    };
    
    db.MapRegion.findAll(options)
    .then(function (mapRegions) {
        var jsonData = mapRegions.map(function (d) {
            return d.toJSON();
        });
        
        callback(null, jsonData);
    })
    .catch(function (error) {
        callback(error);
    });
};

function refresh(callback) {
    console.log('Updating map');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: map, ', error);
            }
            console.log('Update complete: map');
        };
    }
    
    census.mapHex.getAllMapHexs(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                zoneId: d.zone_id,
                mapRegionId: d.map_region_id,
                x: d.x,
                y: d.y,
                hexType: d.hex_type,
                typeName: d.type_name
            };
        });
        
        db.MapHex.truncate().then(function () {
            db.MapHex.bulkCreate(records).then(function () {
                census.mapRegion.getAllMapRegions(function (error, data) {
                    if (error) {
                        return callback(error);
                    }
                    
                    if (data === undefined) {
                        return callback(null);
                    }
                    
                    var records = data.map(function (d) {
                        return {
                            mapRegionId: d.map_region_id,
                            zoneId: d.zone_id,
                            facilityId: d.facility_id,
                            facilityName: d.facility_name,
                            facilityTypeId: d.facility_type_id,
                            facilityType: d.facility_type,
                            x: d.location_x,
                            y: d.location_y,
                            z: d.location_z
                        };
                    });
                    
                    db.MapRegion.bulkCreate(records, {
                        updateOnDuplicate: ['zoneId', 'facilityId', 'facilityName', 'facilityTypeId', 'facilityType', 'x', 'y', 'z']
                    }).then(function () {
                        census.facilityLink.getAllFacilityLinks(function (error, data) {
                            if (error) {
                                return callback(error);
                            }
                            
                            if (data === undefined) {
                                return callback(null);
                            }
                            
                            var records = data.map(function (d) {
                                return {
                                    zoneId: d.zone_id,
                                    facilityIdA: d.facility_id_a,
                                    facilityIdB: d.facility_id_b,
                                    description: d.description
                                };
                            });
                            
                            db.FacilityLink.truncate().then(function () {
                                db.FacilityLink.bulkCreate(records).then(function () {
                                    db.UpdateHistory.upsert({
                                        id: 'map',
                                        lastUpdate: new Date()
                                    });
                                    
                                    clearTimeout(updateTimeout);
                                    updateTimeout = setTimeout(refresh, updateDelay);
                                    
                                    callback();
                                }).catch(function (error) {
                                    callback(error);
                                });
                            }).catch(function (error) {
                                callback(error);
                            });
                        });
                    }).catch(function (error) {
                        callback(error);
                    });
                });
            }).catch(function (error) {
                callback(error);
            });
        }).catch(function (error) {
            callback(error);
        });
    });
}