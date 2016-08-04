var async = require('async');

var census = require('./../census');
var db = require('./../models').models;

var outfitService = require('./outfit');

module.exports.lookupCharactersByName = function (query, limit, callback) {
    census.character.lookupCharactersByName(query, Number(limit) || 12, function (error, data) {
        if (error) {
            return callback(error);
        }
                
        var characters = [];
        try {
            characters = data.map(function (char) {
                return {
                    name: char.name.first,
                    battleRank: Number(char.battle_rank.value),
                    id: char.character_id,
                    factionId: Number(char.faction_id),
                    lastLogin: new Date(char.times.last_login * 1000),
                    worldId: Number(char.world_id),
                    onlineStatus: char.online_status !== '0'
                };
            });
        } catch (ex) {
            return callback(ex);
        }
        
        callback(null, characters);
    });
};

module.exports.getCharacterById = function (characterId, callback) {
    getCharacterById(characterId, function (error, data) {
        if (callback) {
            var res = data ? data.toJSON() : null;
            callback(error, res);
        }
    });
};

module.exports.getCharacterStatsById = function (characterId, callback) {
    getCharacterById(characterId, function (error, character) {
        if (error) {
            return callback(error);
        }

        if (!character) {
            return callback(null);
        }
        
        character.getCharacterStats().then(function (characterStats) {
            if (characterStats && characterStats.length > 0) {
                var results = characterStats.map(function (d) {
                    return d.toJSON();
                });
                return callback(null, results);
            }

            updateCharacterStatsById(characterId, null, callback);
        }).catch(function (error) {
            callback(error);
        });
    });
};

module.exports.getCharacterFactionStatsById = function (characterId, callback) {
    getCharacterById(characterId, function (error, character) {
        if (error) {
            return callback(error);
        }
        
        if (!character) {
            return callback(null);
        }
        
        character.getCharacterStatByFactions().then(function (characterFactionStats) {
            if (characterFactionStats && characterFactionStats.length > 0) {
                var results = characterFactionStats.map(function (d) {
                    return d.toJSON();
                });
                return callback(null, results);
            }
            
            updateCharacterFactionStatsById(characterId, null, callback);
        }).catch(function (error) {
            callback(error);
        });
    });
};

module.exports.getCharacterWeaponStatsById = function (characterId, callback) {
    getCharacterById(characterId, function (error, character) {
        if (error) {
            return callback(error);
        }
        
        if (!character) {
            return callback(null);
        }
        
        character.getCharacterWeaponStats().then(function (weaponStats) {
            if (weaponStats && weaponStats.length > 0) {
                var results = weaponStats.map(function (d) {
                    return d.toJSON();
                });
                return callback(null, results);
            }
            
            updateCharacterWeaponStatsById(characterId, null, callback);
        }).catch(function (error) {
            callback(error);
        });
    });
};

module.exports.getCharacterWeaponFactionStatsById = function (characterId, callback) {
    getCharacterById(characterId, function (error, character) {
        if (error) {
            return callback(error);
        }
        
        if (!character) {
            return callback(null);
        }
        
        character.getCharacterWeaponStatByFactions().then(function (weaponStats) {
            if (weaponStats && weaponStats.length > 0) {
                var results = weaponStats.map(function (d) {
                    return d.toJSON();
                });
                return callback(null, results);
            }
            
            updateCharacterWeaponFactionStatsById(characterId, null, callback);
        }).catch(function (error) {
            callback(error);
        });
    });
};

module.exports.getCharacterOutfitMembershipById = function (characterId, callback) {
    getCharacterById(characterId, function (error, character) {
        if (error) {
            return callback(error);
        }
        
        if (!character) {
            return callback(null);
        }
        
        character.getOutfitMember().then(function (outfitMember) {
            if (outfitMember) {
                return callback(null, outfitMember.toJSON());
            }
            
            updateCharacterOutfitMembershipById(characterId, callback);
        }).catch(function (error) {
            callback(error);
        });
    });
};

module.exports.getCharacterFullById = function (characterId, callback) {
    getCharacterFullById(characterId, function (error, data) {
        if (error) {
            console.log(error);
        }
        callback(error, data ? data.toJSON() : null);
    });
};

module.exports.updateCharacterById = function (characterId, lastLoginDate, callback) {
    updateCharacterFullById(characterId, lastLoginDate, callback);
};

module.exports.findCharacters = function (characterIds, callback) {    
    var options = {
        where: {
            id: characterIds
        },
        attributes: ['id', 'name', 'factionId', 'worldId']
    };
    
    db.Character.findAll(options).then(function (characters) {
        var jsonData = characters.map(function (d) {
            return d.toJSON();
        });
        
        callback(null, jsonData);
    }).catch(function (error) {
        callback(error);
    });
};

function getCharacterById(characterId, callback) {
    var options = {
        include: [
            { model: db.CharacterTime, as: 'times' },
        ]
    };

    db.Character.findById(characterId, options).then(function (character) {
        if (character) {
            return callback(null, character);
        }
        
        updateCharacterById(characterId, callback);
    }).catch(function (error) {
        callback(error);
    });
}

function getCharacterFullById(characterId, callback) {
    var options = {
    include: [
            db.Title,
            db.World,
            db.Faction,
            { model: db.CharacterTime, as: 'times' },
            { model: db.OutfitMember, include: db.Outfit },
            { model: db.CharacterStat, separate: true, include: [db.Profile] },
            { model: db.CharacterStatByFaction, separate: true, include: [db.Profile] },
            { model: db.CharacterWeaponStat, separate: true, include: [{ model: db.Item, where: { typeId: 26 }, include: db.ItemCategory }, db.Vehicle] },
            { model: db.CharacterWeaponStatByFaction, separate: true, include: [{ model: db.Item, where: { typeId: 26 } }, db.Vehicle] }
        ]
    };
    
    db.Character.findById(characterId, options).then(function (character) {
        if (character && character.CharacterStats.length > 0) {
            return callback(null, character);
        }
        
        updateCharacterFullById(characterId, null, function (error) {
            if (error) {
                return callback(error);
            }

            db.Character.findById(characterId, options).then(function (character) {
                callback(null, character);
            });
        });
    }).catch(function (error) {
        callback(error);
    });
}

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

function updateCharacterById (characterId, callback) {
    census.character.getCharacter(characterId, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
                
        db.Character.upsert({
            id: data.character_id,
            name: data.name.first,
            factionId: data.faction_id,
            worldId: data.world_id,
            battleRank: data.battle_rank.value,
            battleRankPercentToNext: data.battle_rank.percent_to_next,
            certsEarned: data.certs.earned_points,
            titleId: data.title_id
        }).then(function () {
            db.Character.findById(characterId).then(function (character) {
                callback(null, character);
            }).catch(function (error) {
                callback(error);
            });
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterFullById(characterId, lastLoginDate, callback) {
    updateCharacterById(characterId, function (error, character) {
        if (error || !character) {
            return callback(error);
        }
                        
        var errors = [];
        async.parallel([
            function (cb) {
                updateCharacterTimesById(characterId, cb);
            },
            function (cb) {
                updateCharacterStatsById(characterId, lastLoginDate, cb);
            },
            function (cb) {
                updateCharacterFactionStatsById(characterId, lastLoginDate, cb);
            },
            function (cb) {
                updateCharacterWeaponStatsById(characterId, lastLoginDate, cb);
            },
            function (cb) {
                updateCharacterWeaponFactionStatsById(characterId, lastLoginDate, cb);
            },
            function (cb) {
                updateCharacterOutfitMembershipById(characterId, cb);
            }
        ], function (error, results) {
            if (error) {
                errors.push(error);
                callback(errors);
            } else if (errors.length > 0) {
                callback(errors);
            } else {
                callback();
            }
        });
    });
}

function updateCharacterTimesById(characterId, callback) {
    census.character.getCharacterTimes(characterId, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        db.CharacterTime.upsert({
            id: data.character_id,
            createdDate: createDateAsUTC(new Date(data.times.creation_date)),
            lastSaveDate: createDateAsUTC(new Date(data.times.last_save_date)),
            lastLoginDate: createDateAsUTC(new Date(data.times.last_login_date)),
            minutesPlayed: data.times.minutes_played
        }).then(function () {
            db.CharacterTime.findById(characterId).then(function (characterTime) {
                callback(null, characterTime);
            }).catch(function (error) {
                callback(error);
            });
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterStatsById (characterId, lastLoginDate, callback) {
    census.character.getCharacterStats(characterId, lastLoginDate, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                characterId: d.character_id,
                stat: d.stat_name,
                profileId: d.profile_id,
                valueDaily: d.value_daily,
                valueWeekly: d.value_weekly,
                valueMonthly: d.value_monthly,
                valueForever: d.value_forever
            };
        });
        
        db.CharacterStat.bulkCreate(records, {
            updateOnDuplicate: ['valueDaily', 'valueWeekly', 'valueMonthly', 'valueForever']
        }).then(function (data) {
            var results = data.map(function (d) {
                return d.toJSON();
            });
            callback(null, results);
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterFactionStatsById (characterId, lastLoginDate, callback) {
    census.character.getCharacterFactionStats(characterId, lastLoginDate, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                characterId: d.character_id,
                stat: d.stat_name,
                profileId: d.profile_id,
                valueForeverVs: d.value_forever_vs,
                valueForeverNc: d.value_forever_nc,
                valueForeverTr: d.value_forever_tr,
                valueMonthlyVs: d.value_monthly_vs,
                valueMonthlyNc: d.value_monthly_nc,
                valueMonthlyTr: d.value_monthly_tr,
                valueWeeklyVs: d.value_weekly_vs,
                valueWeeklyNc: d.value_weekly_nc,
                valueWeeklyTr: d.value_weekly_tr,
                valueDailyVs: d.value_daily_vs,
                valueDailyNc: d.value_daily_nc,
                valueDailyTr: d.value_daily_tr
            };
        });
        
        db.CharacterStatByFaction.bulkCreate(records, {
            updateOnDuplicate: ['valueForeverVs', 'valueForeverNc', 'valueForeverTr', 'valueMonthlyVs', 'valueMonthlyNc', 'valueMonthlyTr', 'valueWeeklyVs', 'valueWeeklyNc', 'valueWeeklyTr', 'valueDailyVs', 'valueDailyNc', 'valueDailyTr']
        }).then(function (data) {
            var results = data.map(function (d) {
                return d.toJSON();
            });
            callback(null, results);
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterWeaponStatsById (characterId, lastLoginDate, callback) {
    census.character.getCharacterWeaponStats(characterId, lastLoginDate, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                characterId: d.character_id,
                stat: d.stat_name,
                itemId: d.item_id,
                vehicleId: d.vehicle_id,
                value: d.value
            };
        });
        
        db.CharacterWeaponStat.bulkCreate(records, {
            updateOnDuplicate: ['value']
        }).then(function (data) {
            var results = data.map(function (d) {
                return d.toJSON();
            });
            callback(null, results);
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterWeaponFactionStatsById (characterId, lastLoginDate, callback) {
    census.character.getCharacterWeaponStatsByFaction(characterId, lastLoginDate, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                characterId: d.character_id,
                stat: d.stat_name,
                itemId: d.item_id,
                vehicleId: d.vehicle_id,
                valueVs: d.value_vs,
                valueNc: d.value_nc,
                valueTr: d.value_tr
            };
        });
        
        db.CharacterWeaponStatByFaction.bulkCreate(records, {
            updateOnDuplicate: ['valueVs', 'valueNc', 'valueTr']
        }).then(function (data) {
            var results = data.map(function (d) {
                return d.toJSON();
            });
            
            callback(null, results);
        }).catch(function (error) {
            callback(error);
        });
    });
}

function updateCharacterOutfitMembershipById(characterId, callback) {
    census.character.getCharacterOutfitMembership(characterId, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            db.OutfitMember.destroy({
                where: {
                    characterId: characterId
                }
            });

            return callback(null);
        }
        
        outfitService.getOutfitById(data.outfit_id, function (error) {
            if (error) {
                return callback(error);
            }
            
            db.OutfitMember.upsert({
                characterId: data.character_id,
                outfitId: data.outfit_id,
                memberSinceDate: createDateAsUTC(new Date(data.member_since_date)),
                rank: data.rank,
                rankOrdinal: data.rank_ordinal,
            }).then(function () {
                db.OutfitMember.findById(characterId).then(function (outfitMember) {
                    callback(null, outfitMember);
                }).catch(function (error) {
                    callback(error);
                });
            }).catch(function (error) {
                callback(error);
            });
        });
    });
}