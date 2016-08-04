module.exports = function (censusBase) {
    this.getAllProfiles = function (callback) {
        var query = censusBase.createQuery('profile');
        query.setLanguage('en');
        
        query.showFields([
            'profile_id',
            'profile_type_id',
            'faction_id',
            'name',
            'image_id'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};