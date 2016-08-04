'use strict';

module.exports = function (sequelize, DataTypes) {
    var Title = sequelize.define('Title', {
        id: {
            type: DataTypes.INTEGER,
            field: 'title_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        }
    },
	{
        tableName: 'title'
    });
    
    return Title;
};