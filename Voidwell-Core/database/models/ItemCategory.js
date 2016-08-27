'use strict';

module.exports = function (sequelize, DataTypes) {
    var ItemCategory = sequelize.define('ItemCategory', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'item_category_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name',
        }
    },
	{
        tableName: 'item_category'
    });
    
    return ItemCategory;
};