module.exports = function (censusBase) {  
    this.getCharacter = function (id, callback) {
        var query = censusBase.createQuery('character');
        query.resolve(['world']);
        query.showFields([
            'character_id',
            'name.first',
            'faction_id',
            'world_id',
            'battle_rank.value',
            'battle_rank.percent_to_next',
            'certs.earned_points',
            'title_id'
        ]);
        
        query.where('character_id').equals(id);
        
        censusBase.fetchData(query, false, callback);
    };
    
    this.getCharacterTimes = function (id, callback) {
        var query = censusBase.createQuery('character');
        query.showFields([
            'character_id',
            'times.creation_date',
            'times.last_save_date',
            'times.last_login_date',
            'times.minutes_played'
        ]);
        
        query.where('character_id').equals(id);
        
        censusBase.fetchData(query, false, callback);
    };
    
    this.getCharacterStats = function (id, lastLogin, callback) {
        var query = censusBase.createQuery('characters_stat');
        query.setLimit(500);
        query.showFields([
            'character_id',
            'stat_name',
            'profile_id',
            'value_forever',
            'value_monthly',
            'value_weekly',
            'value_daily'
        ]);
        
        query.where('character_id').equals(id);
        
        if (lastLogin) {
            try {
                var lastLoginStr = censusBase.convertDate(lastLogin);
                query.where('last_save_date').isGreaterThanOrEquals(lastLoginStr);
            } catch (ex) { }
        }
        
        censusBase.fetchData(query, true, callback);
    };
    
    this.getCharacterFactionStats = function (id, lastLogin, callback) {
        var query = censusBase.createQuery('characters_stat_by_faction');
        query.setLimit(500);
        query.showFields([
            'character_id',
            'stat_name',
            'profile_id',
            'value_forever_vs',
            'value_forever_nc',
            'value_forever_tr',
            'value_monthly_vs',
            'value_monthly_nc',
            'value_monthly_tr',
            'value_weekly_vs',
            'value_weekly_nc',
            'value_weekly_tr',
            'value_daily_vs',
            'value_daily_nc',
            'value_daily_tr'
        ]);
        
        query.where('character_id').equals(id);
        
        if (lastLogin) {
            try {
                var lastLoginStr = censusBase.convertDate(lastLogin);
                query.where('last_save_date').isGreaterThanOrEquals(lastLoginStr);
            } catch (ex) { }
        }
        
        censusBase.fetchData(query, true, callback);
    };
    
    this.getCharacterWeaponStats = function (id, lastLogin, callback) {
        var query = censusBase.createQuery('characters_weapon_stat');
        query.setLimit(5000);
        query.showFields([
            'character_id',
            'stat_name',
            'item_id',
            'vehicle_id',
            'value'
        ]);
        
        query.where('character_id').equals(id);
        
        if (lastLogin) {
            try {
                var lastLoginStr = censusBase.convertDate(lastLogin);
                query.where('last_save_date').isGreaterThanOrEquals(lastLoginStr);
            } catch (ex) { }
        }
        
        censusBase.fetchData(query, true, callback);
    };
    
    this.getCharacterWeaponStatsByFaction = function (id, lastLogin, callback) {
        var query = censusBase.createQuery('characters_weapon_stat_by_faction');
        query.setLimit(5000);
        query.showFields([
            'character_id',
            'stat_name',
            'item_id',
            'vehicle_id',
            'value_vs',
            'value_nc',
            'value_tr'
        ]);
        
        query.where('character_id').equals(id);
        
        if (lastLogin) {
            try {
                var lastLoginStr = censusBase.convertDate(lastLogin);
                query.where('last_save_date').isGreaterThanOrEquals(lastLoginStr);
            } catch (ex) { }
        }
        
        censusBase.fetchData(query, true, callback);
    };
    
    this.getCharacterOutfitMembership = function (id, callback) {
        var query = censusBase.createQuery('outfit_member');
        query.showFields([
            'character_id',
            'outfit_id',
            'member_since_date',
            'rank',
            'rank_ordinal'
        ]);
        
        query.where('character_id').equals(id);       
        
        censusBase.fetchData(query, false, callback);
    };
    
    this.lookupCharactersByName = function (name, limit, callback) {
        var defaultLimit = limit || 12;
        
        var query = censusBase.createQuery('character');
        query.setLimit(defaultLimit);
        query.settings.exactMatchFirst = true;
        query.resolve([
            'online_status',
            'world'
        ]);
        query.showFields([
            'character_id',
            'name.first',
            'battle_rank.value',
            'faction_id',
            'times.last_login'
        ]);
        
        query.where('name.first_lower').startsWith(name.toLowerCase());
        query.where('battle_rank.value').isGreaterThan(0);
        
        censusBase.fetchData(query, true, callback);
    };
        
    return this;
};
