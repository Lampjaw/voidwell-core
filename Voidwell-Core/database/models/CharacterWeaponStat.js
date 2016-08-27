'use strict';

module.exports = function (sequelize, DataTypes) {
	var CharacterWeaponStat = sequelize.define('CharacterWeaponStat', {
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
        value: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'value'
        }
	}, {
		tableName: 'character_weapon_stat',
        classMethods: {
            associate: function (models) {
                CharacterWeaponStat.belongsTo(models.Character, {
                    constraints: false,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    }
                });

                CharacterWeaponStat.belongsTo(models.Item, {
                    constraints: false,
                    foreignKey: {
                        field: 'item_id',
                        primaryKey: true
                    }
                });
                
                CharacterWeaponStat.belongsTo(models.Vehicle, {
                    constraints: false,
                    foreignKey: {
                        field: 'vehicle_id'
                    }
                });
            }
        }
	});
	
	return CharacterWeaponStat;
};