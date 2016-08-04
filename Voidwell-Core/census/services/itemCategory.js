module.exports = function (censusBase) {
    this.getAllItemCategories = function (callback) {
        var query = censusBase.createQuery('item_category');
        query.setLanguage('en');
        
        query.showFields([
            'item_category_id',
            'name'
        ]);
        
        censusBase.fetchAllData(query, callback);
    };
    
    return this;
};