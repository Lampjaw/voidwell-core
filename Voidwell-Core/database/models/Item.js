'use strict';

module.exports = function (sequelize, DataTypes) {
    var Item = sequelize.define('Item', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'item_id',
            primaryKey: true
        },
        typeId: {
            type: DataTypes.INTEGER,
            field: 'item_type_id'
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'item_category_id'
        },
        isVehicleWeapon: {
            type: DataTypes.BOOLEAN,
            field: 'is_vehicle_weapon'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        },
        factionId: {
            type: DataTypes.INTEGER,
            field: 'faction_id'
        },
        maxStackSize: {
            type: DataTypes.INTEGER,
            field: 'max_stack_size'
        },
        imageId: {
            type: DataTypes.INTEGER,
            field: 'image_id'
        }
    },
	{
        tableName: 'item',
        classMethods: {
            associate: function (models) {                
                Item.belongsTo(models.ItemCategory, {
                    constraints: false,
                    foreignKey: 'categoryId'
                });
            }
        }
    });
    
    return Item;
};