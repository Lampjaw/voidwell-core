'use strict';

module.exports = function (sequelize, DataTypes) {
    var MapRegion = sequelize.define('MapRegion', {
        mapRegionId: {
            type: DataTypes.INTEGER,
            field: 'map_region_id',
            primaryKey: true
        },
        zoneId: {
            type: DataTypes.INTEGER,
            field: 'zone_id'
        },
        facilityId: {
            type: DataTypes.INTEGER,
            field: 'facility_id'
        },
        facilityName: {
            type: DataTypes.STRING,
            field: 'facility_name'
        },
        facilityTypeId: {
            type: DataTypes.INTEGER,
            field: 'facility_type_id'
        },
        facilityType: {
            type: DataTypes.STRING,
            field: 'facility_type'
        },
        x: {
            type: DataTypes.FLOAT,
            field: 'x'
        },
        y: {
            type: DataTypes.FLOAT,
            field: 'y'
        },
        z: {
            type: DataTypes.FLOAT,
            field: 'z'
        }
    },
	{
        tableName: 'map_region'
    });
    
    return MapRegion;
};