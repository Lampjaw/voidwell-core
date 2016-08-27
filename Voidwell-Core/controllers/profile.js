var profileService = require('./../services/profile');

module.exports.getAllProfiles = function (req, res, next) {
    profileService.getAllProfiles(function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve profiles'));
        }

        res.json(response);
    });
};