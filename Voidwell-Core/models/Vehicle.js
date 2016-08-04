'use strict';

module.exports = function (sequelize, DataTypes) {
    var Vehicle = sequelize.define('Vehicle', {
        id: {
            type: DataTypes.INTEGER,
            field: 'vehicle_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        },
        cost: {
            type: DataTypes.INTEGER,
            field: 'cost'
        },
        costResourceId: {
            type: DataTypes.INTEGER,
            field: 'cost_resource_id'
        },
        imageId: {
            type: DataTypes.INTEGER,
            field: 'image_id'
        }
    },
	{
        tableName: 'vehicle',
        classMethods: {
            associate: function (models) {                
                Vehicle.hasMany(models.VehicleFaction, {
                    constraints: false,
                    foreignKey: 'vehicleId'
                });
            }
        }
    });
    
    return Vehicle;
};