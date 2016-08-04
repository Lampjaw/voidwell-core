'use strict';

module.exports = function (sequelize, DataTypes) {
    var MapHex = sequelize.define('MapHex', {
        zoneId: {
            type: DataTypes.INTEGER,
            field: 'zone_id'
        },
        mapRegionId: {
            type: DataTypes.INTEGER,
            field: 'map_region_id'
        },
        x: {
            type: DataTypes.INTEGER,
            field: 'x'
        },
        y: {
            type: DataTypes.INTEGER,
            field: 'y'
        },
        hexType: {
            type: DataTypes.INTEGER,
            field: 'hex_type'
        },
        typeName: {
            type: DataTypes.STRING,
            field: 'type_name'
        }
    },
	{
        tableName: 'map_hex'
    });
    
    return MapHex;
};