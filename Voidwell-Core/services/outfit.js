var async = require('async');

var census = require('./../census');
var db = require('./../models').models;

var characterService = require('./character');

module.exports.lookupOutfitsByName = function (name, limit, callback) {
    var findParams = {
        where: {
            $or: [
                { alias: name },
                {
                    name: {
                        $like: '%' + name + '%'
                    }
                }
            ]
        },
        limit: Number(limit) || 12
    };

    db.Outfit.findAll(findParams)
        .then(function (data) {
            var jsonData = data.map(function (d) {
                return d.toJSON();
            });
            
            callback(null, jsonData);
        })
        .catch(function (error) {
            callback(error);
        });
};

module.exports.getOutfitById = function (id, callback) {
    getOutfitById(id, function (error, outfit) {
        callback(error, outfit ? outfit.toJSON() : null);
    });
};

module.exports.getOutfitFullById = function (id, callback) {
    getOutfitFullById(id, function (error, outfit) {
        callback(error, outfit ? outfit.toJSON() : null);
    });
};

module.exports.getOutfitMembers = function (id, callback) {
    getOutfitById(id, function (error, outfit) {
        var options = {
            include: [
                {
                    model: db.Character,
                    include: [
                        {
                            model: db.CharacterStat,
                            where: { profileId: 0 }
                        },
                        {
                            model: db.CharacterStatByFaction,
                            where: { profileId: 0 }
                        }
                    ]
                }
            ]
        };
        
        outfit.getOutfitMembers(options)
        .then(function (results) {
            var data = results.map(function (d) {
                return d.toJSON();
            });
            
            data.forEach(function (d) {
                var char = d.Character;
                
                d.name = char.name;
                d.battleRank = char.battleRank;
                d.certsEarned = char.certsEarned;
                d.createdDate = char.createdDate;
                d.lastLoginDate = char.lastSaveDate;
                d.minutesPlayed = char.minutesPlayed;
                
                d.lifetimeStats = {};
                
                if (char.CharacterStats) {
                    char.CharacterStats.forEach(function (stat) {
                        d.lifetimeStats[stat.stat] = Number(stat.valueForever);
                    });
                }
                
                if (char.CharacterStatByFactions) {
                    char.CharacterStatByFactions.forEach(function (stat) {
                        d.lifetimeStats[stat.stat] = Number(stat.valueForeverVs) + Number(stat.valueForeverNc) + Number(stat.valueForeverTr);
                    });
                }
                
                delete d.Character;

                if (d.lifetimeStats.facility_capture_count && d.lifetimeStats.facility_defended_count) {
                    d.lifetimeStats.siege_level = d.lifetimeStats.facility_capture_count / d.lifetimeStats.facility_defended_count * 100;
                }
            });

            callback(error, data);
        })
        .catch(function (error) {
            callback(error);
        })

    });
};

module.exports.updateOutfitById = function (outfitId, callback) {
    updateOutfitById(outfitId, callback);
};

module.exports.findOutfits = function (outfitIds, callback) {
    var options = {
        where: {
            id: outfitIds
        },
        attributes: ['id', 'name', 'alias', 'factionId']
    };
    
    db.Outfit.findAll(options).then(function (outfits) {
        var jsonData = outfits.map(function (d) {
            return d.toJSON();
        });
        
        callback(null, jsonData);
    }).catch(function (error) {
        callback(error);
    });
};

function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

function getOutfitById(id, callback) {
    db.Outfit.findById(id).then(function (outfit) {
        if (outfit) {
            return callback(null, outfit);
        }
        
        updateOutfitById(id, callback);
    }).catch(function (error) {
        callback(error);
    });
}

function getOutfitFullById(id, callback) {
    var options = {
        include: [db.World, db.Faction, db.Character]
    };

    db.Outfit.findById(id, options).then(function (outfit) {
        if (outfit) {
            return callback(null, outfit);
        }
        
        updateOutfitById(id, function (error, outfit) {
            if (error) {
                return callback(error);
            }

            db.Outfit.findById(id, options).then(function (outfit) {
                callback(null, outfit);
            }).catch(function (error) {
                callback(error);
            });
        });
    }).catch(function (error) {
        callback(error);
    });
}

function updateOutfitById(outfitId, callback) {
    census.outfit.getOutfit(outfitId, function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (!data) {
            return callback('No Outfit found with this id');
        }
        
        census.character.getCharacter(data.leader_character_id, function (error, leaderCharacter) {
            if (error) {
                return callback(error);
            }
            
            if (!leaderCharacter) {
                return callback('Outfit leader could not be resolved');
            }

            db.Outfit.upsert({
                id: data.outfit_id,
                name: data.name,
                alias: data.alias,
                createdDate: createDateAsUTC(new Date(data.time_created_date)),
                leaderCharacterId: data.leader_character_id,
                memberCount: data.member_count,
                factionId: leaderCharacter.factionId,
                worldId: leaderCharacter.worldId
            }).then(function () {
                db.Outfit.findById(outfitId).then(function (outfit) {
                    callback(null, outfit);
                }).catch(function (error) {
                    callback(error);
                });
            }).catch(function (error) {
                callback(error);
            });
        });
    });
}