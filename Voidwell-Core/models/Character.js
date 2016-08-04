'use strict';

module.exports = function (sequelize, DataTypes) {
	var Character = sequelize.define('Character', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			field: 'character_id',
			primaryKey: true
		},
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        factionId: {
            type: DataTypes.INTEGER,
            field: 'faction_id'
        },
        worldId: {
            type: DataTypes.INTEGER,
            field: 'world_id'
        },
        battleRank: {
            type: DataTypes.INTEGER,
            field: 'battle_rank'
        },
        battleRankPercentToNext: {
            type: DataTypes.INTEGER,
            field: 'battle_rank_percent_to_next'
        },
        certsEarned: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'certs_earned'
        },
        titleId: {
            type: DataTypes.INTEGER,
            field: 'title_id'
        }
	},
	{
		tableName: 'character',
        classMethods: {
            associate: function (models) {                
                Character.hasOne(models.CharacterTime, {
                    as: 'times',
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });

                Character.hasMany(models.CharacterStat, {
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });
                
                Character.hasMany(models.CharacterStatByFaction, {
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });
                
                Character.hasMany(models.CharacterWeaponStat, {
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });
                
                Character.hasMany(models.CharacterWeaponStatByFaction, {
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });
                
                Character.hasMany(models.CharacterIviStat, {
                    constraints: true,
                    foreignKey: {
                        field: 'character_id',
                        primaryKey: true
                    },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });

                Character.hasOne(models.OutfitMember, {
                    constraints: false,
                    foreignKey: 'characterId'
                });

                Character.belongsTo(models.World, {
                    constraints: false,
                    foreignKey: 'worldId'
                });
                
                Character.belongsTo(models.Title, {
                    constraints: false,
                    foreignKey: 'titleId'
                });
                
                Character.belongsTo(models.Faction, {
                    constraints: false,
                    foreignKey: 'factionId'
                });
            }
        }
    });
    
    return Character;
};