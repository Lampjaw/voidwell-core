'use strict';

module.exports = function (sequelize, DataTypes) {
    var Faction = sequelize.define('Faction', {
        id: {
            type: DataTypes.INTEGER,
            field: 'faction_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        imageId: {
            type: DataTypes.INTEGER,
            field: 'image_id'
        },
        codeTag: {
            type: DataTypes.STRING,
            field: 'code_tag'
        },
        userSelectable: {
            type: DataTypes.BOOLEAN,
            field: 'user_selectable'
        }
    },
	{
        tableName: 'faction'
    });
    
    return Faction;
};