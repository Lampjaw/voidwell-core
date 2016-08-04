module.exports = function (censusBase) {
    this.getAllWorlds = function (callback) {
        var query = censusBase.createQuery('world');
        query.setLanguage('en');
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};