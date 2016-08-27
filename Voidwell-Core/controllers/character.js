var characterService = require('./../services/character');

module.exports.lookupCharactersByName = function (query, limit, req, res, next) {
    characterService.lookupCharactersByName(query, limit, function (error, response) {
        if (error) {
            return res.json(new Error('Could not looking characters'));
        }

        res.json(response);
    });
};

module.exports.getCharacterById = function (characterId, req, res, next) {
    characterService.getCharacterById(characterId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve character'));
        }

        res.json(response);
    });
};

module.exports.getCharacterFullById = function (characterId, req, res, next) {
    characterService.getCharacterFullById(characterId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve character'));
        }

        res.json(response);
    });
};

module.exports.updateCharacterById = function (characterId, lastLoginDate, req, res, next) {
    characterService.updateCharacterById(characterId, lastLoginDate, function (error, response) {
        if (error) {
            return res.json(new Error('Could not update character'));
        }

        res.json(response);
    });
};

module.exports.findCharacters = function (characterIds, req, res, next) {
    characterService.findCharacters(characterIds, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve characters'));
        }

        res.json(response);
    });
};

module.exports.getCharactersOutfit = function (characterId, req, res, next) {
    characterService.getCharactersOutfit(characterId, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve characters outfit'));
        }

        res.json(response);
    });
};