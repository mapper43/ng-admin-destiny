export default function (nga, admin) {
    
    var carnagereport = admin.getEntity('carnagereport');
    
    carnagereport.identifier(nga.field('entryid'));
    
    carnagereport.url(function(entityName, viewType, identifierValue, identifierName) {
            return 'Stats/PostGameCarnageReport/activityid';
    });
    
    carnagereport.listView()
    .title('Carnage Report')   
    .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'player.destinyUserInfo.iconPath\'] }}" width="48" height="48" />'),
            //nga.field('characterId'),
            nga.field('player.characterLevel').label('Level'),
            nga.field('player.characterClass').label('Class'),
            nga.field('player.destinyUserInfo.displayName').label('Name'),
            nga.field('values.assists.basic.displayValue').label('Assists'),
            nga.field('values.completed.basic.displayValue').label('Completed'),
            nga.field('values.deaths.basic.displayValue').label('Deaths'),
            nga.field('values.kills.basic.displayValue').label('Kills'),
            nga.field('values.killsDeathsRatio.basic.displayValue').label('K/D'),
            nga.field('values.killsDeathsAssists.basic.displayValue').label('K/D/A'),
            nga.field('values.activityDurationSeconds.basic.displayValue').label('Duration'),
            nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/charactersummary/show/{{entry.values[\'player.destinyUserInfo.membershipType\']}}-{{entry.values[\'player.destinyUserInfo.membershipId\']}}-{{entry.values[\'characterId\']}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Character</a>'),
        ])
        .batchActions([])
        .perPage(100)
        .actions(['back']);
    
    return carnagereport;
    
}
