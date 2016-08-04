'use strict';

module.exports = function (sequelize, DataTypes) {
    var Profile = sequelize.define('Profile', {
        id: {
            type: DataTypes.INTEGER,
            field: 'profile_id',
            primaryKey: true
        },
        typeId: {
            type: DataTypes.INTEGER,
            field: 'profile_type_id'
        },
        factionId: {
            type: DataTypes.INTEGER,
            field: 'faction_id'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        imageId: {
            type: DataTypes.INTEGER,
            field: 'image_id'
        }
    },
	{
        tableName: 'profile'
    });
    
    return Profile;
};