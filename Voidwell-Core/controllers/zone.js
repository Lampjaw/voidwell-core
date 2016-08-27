var zoneService = require('./../services/zone');

module.exports.getAllZones = function (req, res, next) {
    zoneService.getAllZones(function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve zones'));
        }

        res.json(response);
    })
};