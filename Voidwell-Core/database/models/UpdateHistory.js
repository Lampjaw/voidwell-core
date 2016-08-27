'use strict';

module.exports = function (sequelize, DataTypes) {
    var UpdateHistory = sequelize.define('UpdateHistory', {
        id: {
            type: DataTypes.STRING,
            field: 'id',
            primaryKey: true
        },
        lastUpdate: {
            type: DataTypes.DATE,
            field: 'last_update'
        }
    },
	{
        tableName: 'update_history'
    });
    
    return UpdateHistory;
};