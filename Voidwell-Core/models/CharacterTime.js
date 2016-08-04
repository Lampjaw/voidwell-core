'use strict';

module.exports = function (sequelize, DataTypes) {
    var CharacterTime = sequelize.define('CharacterTime', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'character_id',
            primaryKey: true
        },
        createdDate: {
            type: DataTypes.DATE,
            field: 'created_date'
        },
        lastSaveDate: {
            type: DataTypes.DATE,
            field: 'last_save_date'
        },
        lastLoginDate: {
            type: DataTypes.DATE,
            field: 'last_login_date'
        },
        minutesPlayed: {
            type: DataTypes.INTEGER,
            field: 'minutes_played'
        }
    },
	{
        tableName: 'character_time'
    });
    
    return CharacterTime;
};