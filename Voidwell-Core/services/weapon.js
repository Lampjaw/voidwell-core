var census = require('./../census');
var db = require('./../database');

module.exports.getWeaponInfo = function (id, callback) {
    census.item.getWeaponInfo(id, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data.name && data.name.en) {
            data.name = data.name.en;
        }
        
        if (data.description && data.description.en) {
            data.description = data.description.en;
        }
        
        if (data.datasheet && data.datasheet.range && data.datasheet.range.en) {
            data.datasheet.range = data.datasheet.range.en;
        }
        
        if (data.category && data.category.name && data.category.name.en) {
            data.category = data.category.name.en;
        }
        
        if (data.fire_mode) {
            for (var i = 0; i < data.fire_mode.length; i++) {
                if (data.fire_mode[i].description && data.fire_mode[i].description.en) {
                    data.fire_mode[i].description = data.fire_mode[i].description.en;
                }
            }
        }
        
        callback(null, data);
    });
};

module.exports.getLeaderboard = function (id, sortCol, sortDirection, rowStart, limit, callback) {
    var options = {
        where: {
            itemId: id,
            stat: sortCol
        },
        limit: Number(limit),
        offset: Number(rowStart),
        include: [
            {
                model: db.Character,
                include: [
                    {
                        model: db.CharacterWeaponStat,
                        where: {
                            itemId: id
                        }
                    },
                    {
                        model: db.CharacterWeaponStatByFaction,
                        where: {
                            itemId: id
                        }
                    }
                ]
            }
        ]
    };

    var weaponStatCols = ['weapon_score', 'weapon_play_time', 'weapon_hit_count', 'weapon_fire_count', 'weapon_deaths'];
    var weaponStatFactionCols = ['weapon_vehicle_kills', 'weapon_kills', 'weapon_killed_by', 'weapon_headshots', 'weapon_damage_given'];
    
    var promise;
    if (weaponStatCols.indexOf(sortCol) > -1) {
        options.order = [['value', sortDirection]];
        promise = db.CharacterWeaponStat.findAll(options)
    } else {
        options.order = 'value_vs + value_nc + value_tr ' + sortDirection;
        promise = db.CharacterWeaponStatByFaction.findAll(options);
    }

    promise.then(function (data) {
        var leaderboard = data.map(function (d) {
            var char = d.Character;
            var stats = {};
                        
            var charWeaponStats = char.CharacterWeaponStats;
            var charWeaponStatsByFaction = char.CharacterWeaponStatByFactions;
                        
            for (var i = 0; i < charWeaponStats.length; i++) {
                var stat = charWeaponStats[i];
                stats[stat.stat] = Number(stat.value);
            }
            
            for (var i = 0; i < charWeaponStatsByFaction.length; i++) {
                var stat = charWeaponStatsByFaction[i];
                stats[stat.stat] = Number(stat.valueVs) + Number(stat.valueNc) + Number(stat.valueTr);
            }

            return {
                id: char.id,
                name: char.name,
                factionId: char.factionId,
                worldId: char.worldId,
                stats: stats
            }
        });
        
        callback(null, leaderboard);
    }).catch(function (error) {
        callback(error);
    });
};