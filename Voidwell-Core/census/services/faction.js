module.exports = function (censusBase) {
    this.getAllFactions = function (callback) {
        var query = censusBase.createQuery('faction');
        query.setLanguage('en');
        
        query.showFields([
            'faction_id',
            'name',
            'image_id',
            'code_tag',
            'user_selectable'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};