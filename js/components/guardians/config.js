export default function (nga, admin) {
    
    var guardians = admin.getEntity('guardians');
    
    guardians.url(function(entityName, viewType, identifierValue, identifierName) {
      return 'SearchDestinyPlayer/All/0/';
    });
    
    guardians.listView()
        .title('Guardian Search')
        .fields([
            nga.field('iconPath').label('').template('<img src="http://www.bungie.net{{ entry.values.iconPath }}" height="48" width="48" />'),
            nga.field('displayName').label('Display Name'),
            //nga.field('', 'template').label('').template('<span class="pull-right"><a href="#/characters/list">Show</a>'),
            nga.field('', 'template').label('').template('<a class="btn btn-primary" href="#/characters/show/{{entry.values.membershipType}}-{{entry.values.membershipId}}">Characters</a>'),
            nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="triumphs" filter="{ platformid: entry.values.membershipType, memberid:entry.values.membershipId }" label="Triumphs" size="sm"></ma-filtered-list-button>'),
            //nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="badges" filter="{ platformid: entry.values.membershipType, memberid:entry.values.membershipId }" size="sm"></ma-filtered-list-button>'),
        ])
    .filters([
      nga.field('displayname').label('').attributes({'placeholder': 'Display name'}).pinned(true),
      ])
    .actions(['back'])
    .batchActions([]);
    
    return guardians;
    
}
