module.exports = function (censusBase) {
    this.getAllMapHexs = function (callback) {
        var query = censusBase.createQuery('map_hex');
        
        query.showFields([
            'zone_id',
            'map_region_id',
            'x',
            'y',
            'hex_type',
            'type_name'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};