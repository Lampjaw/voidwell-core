'use strict';

module.exports = function (sequelize, DataTypes) {
    var CharacterStatByFaction = sequelize.define('CharacterStatByFaction',{
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
        valueForeverVs: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_forever_vs'
        },
        valueForeverNc: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_forever_nc'
        },
        valueForeverTr: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_forever_tr'
        },
        valueMonthlyVs: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_monthly_vs'
        },
        valueMonthlyNc: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_monthly_nc'
        },
        valueMonthlyTr: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_monthly_tr'
        },
        valueWeeklyVs: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_weekly_vs'
        },
        valueWeeklyNc: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_weekly_nc'
        },
        valueWeeklyTr: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_weekly_tr'
        },
        valueDailyVs: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_daily_vs'
        },
        valueDailyNc: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_daily_nc'
        },
        valueDailyTr: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'value_daily_tr'
        }
	}, {
		tableName: 'character_stat_by_faction',
        classMethods: {
            associate: function (models) {
                CharacterStatByFaction.belongsTo(models.Character, {
                    foreignKey: 'character_id'
                });
                
                CharacterStatByFaction.belongsTo(models.Profile, {
                    constraints: false,
                    foreignKey: 'profileId',
                    targetKey: 'typeId'
                });
            }
        }
	});
	
	return CharacterStatByFaction;
};