export default function (nga, admin) {
    
    var characters = admin.getEntity('characters');
    
    characters.identifier(nga.field('characterBase.characterId'));
    
    characters.url(function(entityName, viewType, identifierValue, identifierName) {
      return 'platformid/Account/memberid/Summary/';
    });
    
    characters.listView()
    .title('Characters')   
    .fields([
        nga.field('emblemPath').label('').template('<img src="http://www.bungie.net{{ entry.values.emblemPath }}" height="42" width="42" />'),
        nga.field('characterBase.powerLevel').label('Light'),
        nga.field('characterBase.classDef.className').label('Class'),
        //nga.field('characterBase.characterId').label('id'),
        nga.field('characterBase.minutesPlayedTotal').label('Minutes Played'),
        nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="inventory" filter="{platformid: entry.values[\'characterBase.membershipType\'],memberid:entry.values[\'characterBase.membershipId\'],characterid: entry.values[\'characterBase.characterId\']}" label="Inventory" size="sm"></ma-filtered-list-button>'),
        nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="progression" filter="{platformid: entry.values[\'characterBase.membershipType\'],memberid:entry.values[\'characterBase.membershipId\'],characterid: entry.values[\'characterBase.characterId\']}" label="Progression" size="sm"></ma-filtered-list-button>'),
        ])
    .actions(['back','export'])
    .batchActions([]);
    
    return characters;
    
}
