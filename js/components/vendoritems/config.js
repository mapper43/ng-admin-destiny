export default function (nga, admin) {
    
    var vendoritems = admin.getEntity('vendoritems');
    
    vendoritems.identifier(nga.field('categoryTitle'));
    
    vendoritems.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'platformid/MyAccount/Character/characterid/Vendor/vendorid/';
    });
    
    vendoritems.readOnly();
    
    vendoritems.listView()
        .title('Vendor Items')
        .fields([
            nga.field('categoryTitle').label('Category'),
            nga.field('saleItems', 'embedded_list').label('Items')
                    .targetFields([ 
                        nga.field('').label('')
                    .template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="42" width="42" />'),
                        nga.field('definition.itemName').label('Name'),
                        nga.field('definition.itemTypeName').label('Type'),
                        nga.field('definition.tierTypeName').label('Tier'),
                        //nga.field('').label('').template('<div> {{ entry.values }} </div>'),
                        nga.field('item.perks', 'embedded_list').label('')
                            .targetFields([ 
                                nga.field('iconPath').label('').template('<img src="http://www.bungie.net{{ value }}" style="background-color:darkgray;" width="24" height="24" />'),
                                nga.field('definition.displayName').label('Perk'),
                                nga.field('definition.displayDescription').label('Description'),
                                ])
                    ])
            ])
        .actions(['back','export'])
        .perPage(50)
        .batchActions([]);
    
//    vendoritems.showView()
//        .title('Vendor Item Detail')
//        .actions(['back'])
//        .fields([
//            nga.field('vendorHash').label('Name'),
//        ]);    
    
    
    return vendoritems;
    
}

    