'use strict';

module.exports = function (sequelize, DataTypes) {
    var FacilityLink = sequelize.define('FacilityLink', {
        zoneId: {
            type: DataTypes.INTEGER,
            field: 'zone_id'
        },
        facilityIdA: {
            type: DataTypes.INTEGER,
            field: 'facility_id_a'
        },
        facilityIdB: {
            type: DataTypes.INTEGER,
            field: 'facility_id_b'
        },
        description: {
            type: DataTypes.STRING,
            field: 'description'
        }
    },
	{
        tableName: 'facility_link'
    });
    
    return FacilityLink;
};