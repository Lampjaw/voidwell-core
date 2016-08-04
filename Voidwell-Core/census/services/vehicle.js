module.exports = function (censusBase) {
    this.getAllVehicles = function (callback) {
        var query = censusBase.createQuery('vehicle');
        query.setLanguage('en');
        
        query.showFields([
            'vehicle_id',
            'name',
            'description',
            'cost',
            'cost_resource_id',
            'image_id'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    this.getAllVehicleFactions = function (callback) {
        var query = censusBase.createQuery('vehicle_faction');
        
        query.showFields([
            'vehicle_id',
            'faction_id'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};