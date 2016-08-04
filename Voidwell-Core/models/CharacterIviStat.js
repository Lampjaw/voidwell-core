'use strict';

module.exports = function (sequelize, DataTypes) {
	var CharacterIviStat = sequelize.define('CharacterIviStat', {
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
        value: {
            type: DataTypes.FLOAT.UNSIGNED,
            field: 'value'
        }
    }, {
        tableName: 'character_ivi_stat',
        classMethods: {
            associate: function (models) {
                CharacterIviStat.belongsTo(models.Character, {
                    foreignKey: 'character_id'
                });
            }
        }
    });

	return CharacterIviStat;
};