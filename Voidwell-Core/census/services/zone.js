module.exports = function (censusBase) {
    this.getAllZones = function (callback) {
        var query = censusBase.createQuery('zone');
        query.setLanguage('en');
        
        query.showFields([
            'zone_id',
            'code',
            'name',
            'description',
            'hex_size'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};