var itemService = require('./../services/item');

module.exports.lookupItemsByName = function (name, limit, req, res, next) {
    itemService.lookupItemsByName(name, limit, function (error, response) {
        if (error) {
            return res.json(new Error('Could not lookup items'));
        }

        res.json(response);
    });
};

module.exports.findItems = function (itemIds, req, res, next) {
    itemService.findItems(itemIds, function (error, response) {
        if (error) {
            return res.json(new Error('Could not retrieve items'));
        }
        
        res.json(response);
    });
};