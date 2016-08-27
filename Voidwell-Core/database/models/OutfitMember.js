'use strict';

module.exports = function (sequelize, DataTypes) {
    var OutfitMember = sequelize.define('OutfitMember', {
        characterId: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'character_id',
            primaryKey: true
        },
        outfitId: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'outfit_id'
        },
        memberSinceDate: {
            type: DataTypes.DATE,
            field: 'member_since_date'
        },
        rank: {
            type: DataTypes.STRING,
            field: 'rank'
        },
        rankOrdinal: {
            type: DataTypes.INTEGER,
            field: 'rank_ordinal'
        }
    },
	{
        tableName: 'outfit_member',
        classMethods: {
            associate: function (models) {
                OutfitMember.belongsTo(models.Character, {
                    foreignKey: 'characterId',
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });

                OutfitMember.belongsTo(models.Outfit, {
                    foreignKey: 'outfitId',
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION'
                });
            }
        }
    });
    
    return OutfitMember;
};