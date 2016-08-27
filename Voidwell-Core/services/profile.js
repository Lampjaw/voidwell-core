var census = require('./../census');
var db = require('./../database');

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('profile').then(function (record) {
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

module.exports.getAllProfiles = function (callback) {
    db.Profile.findAll()
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

function refresh(callback) {
    console.log('Updating profile');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: profile, ', error);
            }
            console.log('Update complete: profile');
        };
    }

    census.profile.getAllProfiles(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.profile_id,
                typeId: d.profile_type_id,
                factionId: d.faction_id,
                name: d.name ? d.name.en : null,
                imageId: d.image_id
            };
        });
        
        db.Profile.bulkCreate(records, {
            updateOnDuplicate: ['typeId', 'factionId', 'name', 'imageId']
        }).then(function () {
            db.UpdateHistory.upsert({
                id: 'profile',
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