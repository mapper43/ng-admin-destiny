export default function (nga, admin) {
    
    var vault = admin.getEntity('vault');
    
    vault.identifier(nga.field('uniqueId'));
    
    vault.url(function(entityName, viewType, identifierValue, identifierName) {
      return 'platformid/MyAccount/Vault/Summary/';
    });
    
    vault.listView()
    .title('Vault')   
    .fields([
        nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="48" width="48" />'),
        nga.field('primaryStat.value').label(''),
        nga.field('definition.itemName').label('Name'),
        nga.field('definition.itemTypeName').label('Type'),
        nga.field('definition.tierTypeName').label('Tier'),
        //nga.field('definition.icon'),
        
        //nga.field('').template('<div>{{ entry.values }}</div>')
        ])
    .actions(['back','export'])
    .perPage(200)
    .batchActions([]);
    
    return vault;
    
}
