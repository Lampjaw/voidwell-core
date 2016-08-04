var census = require('./../census');
var db = require('./../models').models;

var updateDelay = 1000 * 60 * 60 * 24 * 7;
var updateTimeout;

db.UpdateHistory.findById('title').then(function (record) {
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
    console.log('Updating title');
    
    if (callback === undefined) {
        callback = function (error) {
            if (error) {
                console.log('Update failed: title, ', error);
            }
            console.log('Update complete: title');
        };
    }

    census.title.getAllTitles(function (error, data) {
        if (error) {
            return callback(error);
        }
        
        if (data === undefined) {
            return callback(null);
        }
        
        var records = data.map(function (d) {
            return {
                id: d.title_id,
                name: d.name.en
            };
        });
        
        db.Title.bulkCreate(records, {
            updateOnDuplicate: ['name']
        }).then(function () {
            db.UpdateHistory.upsert({
                id: 'title',
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