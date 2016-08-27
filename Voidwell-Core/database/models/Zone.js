'use strict';

module.exports = function (sequelize, DataTypes) {
    var Zone = sequelize.define('Zone', {
        id: {
            type: DataTypes.INTEGER,
            field: 'zone_id',
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING,
            field: 'code'
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        hexSize: {
            type: DataTypes.INTEGER,
            field: 'hex_size'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        }
    },
	{
        tableName: 'zone'
    });
    
    return Zone;
};