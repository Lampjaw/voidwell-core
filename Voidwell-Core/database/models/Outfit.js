'use strict';

module.exports = function (sequelize, DataTypes) {
    var Outfit = sequelize.define('Outfit', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'outfit_id',
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        alias: {
            type: DataTypes.STRING,
            field: 'alias'
        },
        createdDate: {
            type: DataTypes.DATE,
            field: 'created_date'
        },
        leaderCharacterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'leader_character_id'
        },
        memberCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'member_count'
        },
        factionId: {
            type: DataTypes.INTEGER,
            field: 'faction_id'
        },
        worldId: {
            type: DataTypes.INTEGER,
            field: 'world_id'
        }
    },
	{
        tableName: 'outfit',
        classMethods: {
            associate: function (models) {
                Outfit.hasMany(models.OutfitMember, {
                    constraints: false,
                    foreignKey: 'outfitId'
                });

                Outfit.belongsTo(models.Character, {
                    constraints: false,
                    foreignKey: 'leaderCharacterId'
                });

                Outfit.belongsTo(models.World, {
                    constraints: false,
                    foreignKey: 'worldId'
                });

                Outfit.belongsTo(models.Faction, {
                    constraints: false,
                    foreignKey: 'factionId'
                });
            }
        }
    });
    
    return Outfit;
};