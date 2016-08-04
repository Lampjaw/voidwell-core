module.exports = function (censusBase) {
    this.getAllFacilityLinks = function (callback) {
        var query = censusBase.createQuery('facility_link');
        
        query.showFields([
            'zone_id',
            'facility_id_a',
            'facility_id_b',
            'description'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};