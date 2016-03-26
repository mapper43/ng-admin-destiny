
export default function (nga, admin) {

    var item = admin.getEntity('items');
    
    item.listView()
        .title('All Items')    
        .fields([
            nga.field('icon').label('').template('<img src="http://www.bungie.net{{ entry.values.icon }}" height="42" width="42" />'),        
            nga.field('itemName').label('Name'),
            nga.field('itemDescription').label('Description'),
            nga.field('itemTypeName').label('Type'),
            nga.field('tierTypeName').label('Tier')
            //,'template').label('icon').template('<img src="{{ entry.icon }}" height="42" width="42" />')
        ])
        .perPage(50)
        .filters([
          nga.field('categories')
        ])
        .actions(['back', 'export']) //'delete','create','edit', 'list', 'show','batch'
        .listActions(['show']) //'edit', 'delete'
        .batchActions([]);

        item.showView()  
        .fields([
            nga.field('icon').label('').template('<img src="http://www.bungie.net{{ entry.values.icon }}" height="42" width="42" />'),        
            nga.field('itemName').label('Name'),
            nga.field('itemDescription').label('Description'),
            nga.field('itemTypeName').label('Type'),
            nga.field('tierTypeName').label('Tier')
            //,'template').label('icon').template('<img src="{{ entry.icon }}" height="42" width="42" />')
        ]);
    
    return item;
}