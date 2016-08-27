var mapService = require('./../services/map');

module.exports.getMapOwnership = function (worldId, zoneId, req, res, next) {
    mapService.getMapOwnership(worldId, zoneId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve map ownership'));
        }

        res.json(response);
    })
};

module.exports.getMapRegions = function (zoneId, req, res, next) {
    mapService.getMapRegions(zoneId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve map regions'));
        }
        
        res.json(response);
    })
};
    
module.exports.getFacilityLinks = function (zoneId, req, res, next) {
    mapService.getFacilityLinks(zoneId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve facility links'));
        }
        
        res.json(response);
    })
};

module.exports.findRegions = function (facilityIds, req, res, next) {    
    mapService.findRegions(facilityIds, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve map regions'));
        }
        
        res.json(response);
    })
};