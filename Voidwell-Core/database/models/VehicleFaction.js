'use strict';

module.exports = function (sequelize, DataTypes) {
    var VehicleFaction = sequelize.define('VehicleFaction', {
        vehicleId: {
            type: DataTypes.INTEGER,
            field: 'vehicle_id',
            primaryKey: true
        },
        factionId: {
            type: DataTypes.INTEGER,
            field: 'faction_id',
            primaryKey: true
        }
    },
	{
        tableName: 'vehicle_faction'
    });
    
    return VehicleFaction;
};