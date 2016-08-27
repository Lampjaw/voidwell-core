var worldService = require('./../services/world');

module.exports.getAllWorlds = function (req, res, next) {
    worldService.getAllWorlds(function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve worlds'));
        }

        res.json(response);
    });
};