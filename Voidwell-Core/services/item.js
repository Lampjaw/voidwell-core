var census = require('./../census');
var db = require('./../models').models;

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('item').then(function (record) {
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

module.exports.lookupItemsByName = function (name, limit, callback) {
    var findParams = {
        where: {
            name: {
                $like: '%' + name + '%'
            },
            categoryId: { lt: 99 }
        },
        limit: Number(limit) || 12
    };
    
    db.Item.findAll(findParams)
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

module.exports.findItems = function (itemIds, callback) {    
    var options = {
        where: {
            id: itemIds
        },
        attributes: ['id', 'name', 'factionId', 'imageId']
    };

    db.Item.findAll(options).then(function (items) {
        var jsonData = items.map(function (d) {
            return d.toJSON();
        });
        
        callback(null, jsonData);
    }).catch(function (error) {
        callback(error);
    });
};

function refresh(callback) {
    console.log('Updating item');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: item, ', error);
            }
            console.log('Update complete: item');
        };
    }

    census.item.getAllItems(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.item_id,
                typeId: d.item_type_id,
                categoryId: d.item_category_id,
                isVehicleWeapon: d.is_vehicle_weapon,
                name: d.name ? d.name.en : null,
                description: d.description ? d.description.en : null,
                factionId: d.faction_id,
                maxStackSize: d.max_stack_size,
                imageId: d.image_id
            };
        });
        
        db.Item.bulkCreate(records, {
            updateOnDuplicate: ['typeId', 'categoryId', 'isVehicleWeapon', 'name' , 'description', 'factionId', 'maxStackSize', 'imageId']
        }).then(function () {
            census.itemCategory.getAllItemCategories(function (error, data) {
                if (error) {
                    return callback(error);
                }
                
                if (data === undefined) {
                    return callback(null);
                }
                
                var records = data.map(function (d) {
                    return {
                        id: d.item_category_id,
                        name: d.name ? d.name.en : 'unknown'
                    };
                });
                
                db.ItemCategory.bulkCreate(records, {
                    updateOnDuplicate: ['name']
                }).then(function () {
                    db.UpdateHistory.upsert({
                        id: 'item',
                        lastUpdate: new Date()
                    });
                    
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(refresh, updateDelay);
                    
                    callback();
                }).catch(function (error) {
                    callback(error);
                });
            });
        }).catch(function (error) {
            callback(error);
        });
    });
}