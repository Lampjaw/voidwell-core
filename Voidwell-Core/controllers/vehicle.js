var vehicleService = require('./../services/vehicle');

module.exports.getAllVehicles = function (req, res, next) {
    vehicleService.getAllVehicles(function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve vehicles'));
        }

        res.json(response);
    });
};