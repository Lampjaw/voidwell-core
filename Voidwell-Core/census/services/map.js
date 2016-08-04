module.exports = function (censusBase) {
    this.getMapOwnership = function (worldId, zoneId, callback) {
        var query = censusBase.createQuery('map');
        query.setLanguage('en');
        
        query.where('world_id').equals(worldId);
        query.where('zone_ids').equals(zoneId);
        
        censusBase.fetchData(query, false, callback);
    };
        
    return this;
};
