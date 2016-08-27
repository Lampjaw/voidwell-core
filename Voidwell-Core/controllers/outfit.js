var outfitService = require('./../services/outfit');

module.exports.lookupOutfitsByName = function (name, limit, req, res, next) {
    outfitService.lookupOutfitsByName(name, limit, function (error, response) {
        if (error) {
            return res.json(new Error('Could not lookup outfits'));
        }

        res.json(response);
    });
};

module.exports.getOutfitById = function (id, req, res, next) {
    outfitService.getOutfitById(id, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve outfit'));
        }
        
        res.json(response);
    });
};

module.exports.getOutfitFullById = function (id, req, res, next) {
    outfitService.getOutfitFullById(id, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve outfit'));
        }
        
        res.json(response);
    });
};

module.exports.getOutfitMembers = function (id, req, res, next) {
    outfitService.getOutfitMembers(id, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve outfit members'));
        }
        
        res.json(response);
    });
};

module.exports.updateOutfitById = function (id, req, res, next) {
    outfitService.updateOutfitById(id, function (error, response) {
        if (error) {
            return res.json(new Error('Could not update outfit'));
        }
        
        res.json(response);
    });
};

module.exports.findOutfits = function (outfitIds, req, res, next) {
    outfitService.findOutfits(outfitIds, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve outfits'));
        }
        
        res.json(response);
    });
};