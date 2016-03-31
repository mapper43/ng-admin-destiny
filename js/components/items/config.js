export default function (nga, admin) {
    
    var items = admin.getEntity('items');
    
    items.identifier(nga.field('itemHash'));
    
    items.url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue)
                return 'Manifest/6/' + identifierValue + '/';
            else
                return 'Explorer/Items/';
        
    });
    
    items.readOnly();
    
    items.listView()
        .title('Items')
        .fields([
            nga.field('icon').label('').template('<img src="http://www.bungie.net{{ value }}" height="48" width="48" />'),        
            nga.field('itemName').label('Name'),
            nga.field('itemTypeName').label('Type'),
            nga.field('tierTypeName').label('Tier'),
            nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/items/show/{{entry.values.itemHash}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
        ])
        .perPage(50)
        .filters([
          nga.field('categories'),
          ])
        .actions(['back', 'export'])
        .sortDir('ASC')
        .sortField('itemName')
        .batchActions([]);
    
    items.showView()
        .title('Item Detail')
        .actions(['back'])
        .fields([
            nga.field('icon').label('').template('<img src="http://www.bungie.net{{ value }}" height="96" width="96" />'),        
            nga.field('itemName').label('Name'),
            nga.field('itemDescription').label('Description'),
            nga.field('itemTypeName').label('Type'),
            nga.field('tierTypeName').label('Tier')
        ]);
    
    return items;
}