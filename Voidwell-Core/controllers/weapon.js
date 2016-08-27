var weaponService = require('./../services/weapon');

module.exports.getWeaponInfo = function (id, req, res, next) {
    weaponService.getWeaponInfo(id, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve weapon info'));
        }

        res.json(response);
    });
};

module.exports.getLeaderboard = function (id, sortCol, sortDirection, rowStart, limit, req, res, next) {
    weaponService.getLeaderboard(id, sortCol, sortDirection, rowStart, limit, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve weapon leaderboard'));
        }
        
        res.json(response);
    });
};