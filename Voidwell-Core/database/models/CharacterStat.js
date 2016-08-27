'use strict';

module.exports = function (sequelize, DataTypes) {
    var CharacterStat = sequelize.define('CharacterStat',{
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
        profileId: {
            type: DataTypes.INTEGER,
            field: 'profile_id',
            primaryKey: true
        },
        valueDaily: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_daily'
        },
        valueWeekly: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_weekly'
        },
        valueMonthly: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_monthly'
        },
        valueForever: {
            type: DataTypes.BIGINT.UNSIGNED,
            field: 'value_forever'
        }
	}, {
        tableName: 'character_stat',
        classMethods: {
            associate: function (models) {
                CharacterStat.belongsTo(models.Character, {
                    foreignKey: 'character_id'
                });
                
                CharacterStat.belongsTo(models.Profile, {
                    constraints: false,
                    foreignKey: 'profileId',
                    targetKey: 'typeId'
                });
            }
        }
    });

    return CharacterStat;
};