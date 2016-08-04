module.exports = function (censusBase) {
    this.getAllTitles = function (callback) {
        var query = censusBase.createQuery('title');
        query.setLanguage('en');
        
        query.showFields([
            'title_id',
            'name'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};