module.exports = function (censusBase) {
    this.getOutfit = function (id, callback) {
        var query = censusBase.createQuery('outfit');
        
        query.showFields([
            'outfit_id',
            'name',
            'alias',
            'time_created_date',
            'leader_character_id',
            'member_count'
        ]);
        
        query.where('outfit_id').equals(id);
        
        censusBase.fetchData(query, false, callback);
    };
    
    return this;
};