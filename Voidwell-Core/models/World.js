'use strict';

module.exports = function (sequelize, DataTypes) {
    var World = sequelize.define('World', {
        id: {
            type: DataTypes.INTEGER,
            field: 'world_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        }
    },
	{
        tableName: 'world'
    });
    
    return World;
};