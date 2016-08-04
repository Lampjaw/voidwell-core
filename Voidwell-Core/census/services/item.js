module.exports = function (censusBase) {
    this.getAllItems = function (callback) {
        var query = censusBase.createQuery('item');
        query.setLanguage('en');

        query.showFields([
            'item_id',
            'item_type_id',
            'item_category_id',
            'is_vehicle_weapon',
            'name',
            'description',
            'faction_id',
            'max_stack_size',
            'image_id'
        ]);
                
        censusBase.fetchAllData(query, callback);
    };
    
    this.getWeaponInfo = function (id, callback) {
        var query = censusBase.createQuery('item');
        query.setLanguage('en');
        query.hideFields([
            'image_set_id',
            'image_path',
            'skill_set_id',
            'is_default_attachment',
            'is_vehicle_weapon',
            'passive_ability_id',
            'activatable_ability_id',
            'item_type_id'
        ]);
        
        var weapon = query.joinService('weapon');
        weapon.injectAt('weapon');
        weapon.onField('item_id');
        weapon.toField('weapon_id');
        weapon.hideFields([
            'weapon_id',
            'weapon_group_id'
        ]);
        
        var datasheet = query.joinService('weapon_datasheet');
        datasheet.injectAt('datasheet');
        datasheet.where('item_id').equals(id);
        datasheet.hideFields([
            'show_clip_size',
            'show_fire_modes',
            'show_range'
        ]);
        
        var itemType = query.joinService('item_category');
        itemType.injectAt('category');
        itemType.onField('item_category_id');
        
        var fireMode = query.joinService('fire_mode');
        fireMode.injectAt('fire_mode');
        fireMode.onField('item_id');
        fireMode.isList(true);
        //fireMode.where('type').equals('primary');
        fireMode.hideFields([
            'pellets_per_shot',
            'pellet_spread',
            'max_speed',
            'projectile_description',
            'damage_type',
            'damage_target_type',
            'damage_resist_type'
        ]);
        
        /*

        var fireMode2 = fireMode.joinService('fire_mode_2');
        fireMode2.injectAt('detail');
        fireMode2.hideFields([
            'fire_mode_id',
            'fire_mode_type_id',
            'ammo_slot',
            'automatic',
            'grief_immune',
            'iron_sights',
            'use_in_water',
            'max_damage',
            'max_damage_range',
            'min_damage',
            'min_damage_range',
            'description',
            'reload_time_ms',
            'reload_chamber_ms',
            'zoom_default',
            'projectile_speed_override'
        ]);

        */

        var playerState = fireMode.joinService('player_state_group');
        playerState.onField('player_state_group_id');
        playerState.isList(true);
        playerState.injectAt('states');
        
        query.where('item_id').equals(id);
        
        censusBase.fetchData(query, false, callback);
    };
        
    return this;
};