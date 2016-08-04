module.exports = function (censusBase) {
    this.getAllMapRegions = function (callback) {
        var query = censusBase.createQuery('map_region');
        
        query.showFields([
            'map_region_id',
            'zone_id',
            'facility_id',
            'facility_name',
            'facility_type_id',
            'facility_type',
            'location_x',
            'location_y',
            'location_z'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};