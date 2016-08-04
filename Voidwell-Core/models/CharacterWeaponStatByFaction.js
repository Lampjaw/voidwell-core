﻿'use strict';

module.exports = function (sequelize, DataTypes) {
	var CharacterWeaponStatByFaction = sequelize.define('CharacterWeaponStatByFaction', {
		characterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'character_id',
			primaryKey: true
		},
		stat: {
            type: DataTypes.STRING,
            field: 'stat',
			primaryKey: true
		},
		itemId: {
            type: DataTypes.INTEGER,
            field: 'item_id',
			primaryKey: true
		},
        vehicleId: {
            type: DataTypes.INTEGER,
            field: 'vehicle_id',
            primaryKey: true
        },
        valueVs: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_vs'
        },
        valueNc: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_nc'
        },
        valueTr: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_tr'
        }
	}, {
		tableName: 'character_weapon_stat_by_faction',
        classMethods: {
            associate: function (models) {
                CharacterWeaponStatByFaction.belongsTo(models.Character, {
                    constraints: false,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    }
                });

                CharacterWeaponStatByFaction.belongsTo(models.Item, {
                    constraints: false,
                    foreignKey: {
                        field: 'item_id',
                        primaryKey: true
                    }
                });
                
                CharacterWeaponStatByFaction.belongsTo(models.Vehicle, {
                    constraints: false,
                    foreignKey: {
                        field: 'vehicle_id'
                    }
                });
            }
        }
	});
	
	return CharacterWeaponStatByFaction;
};