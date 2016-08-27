var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('faction').then(function (record) {
    if (record) {
        var diff = new Date() - record.lastUpdate;
        if (diff > updateDelay) {
            refresh();
        } else {
            updateTimeout = setTimeout(refresh, diff);
        }
    } else {
        refresh();
    }
});

module.exports.refresh = refresh;

function refresh(callback) {
    console.log('Updating faction');

    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: faction, ', error);
            }
            console.log('Update complete: faction');
        };
    }

    census.faction.getAllFactions(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.faction_id,
                name: d.name ? d.name.en : null,
                imageId: d.image_id,
                codeTag: d.code_tag,
                userSelectable: d.user_selectable
            };
        });
        
        db.Faction.bulkCreate(records, {
            updateOnDuplicate: ['name', 'imageId', 'codeTag', 'userSelectable']
        }).then(function () {
            db.UpdateHistory.upsert({
                id: 'faction',
                lastUpdate: new Date()
            });
            
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(refresh, updateDelay);

            callback();
        }).catch(function (error) {
            callback(error);
        });
    });
}