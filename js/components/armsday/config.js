export default function (nga, admin) {
    
    var armsday = admin.getEntity('armsday');
    
    armsday.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
        
    });
    
    armsday.readOnly();
    
    armsday.showView()
        .title('Arms Day')
        .fields([
            nga.field('active'),
            nga.field('startDate'),
            nga.field('endDate'),
            nga.field('nextStartDate'),
            nga.field('canPlaceOrder'),
            nga.field('orders', 'embedded_list').label('Orders')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('item.definition.itemName').label('Name'),
                    nga.field('item.definition.tierTypeName').label('Tier'),
                    nga.field('item.definition.itemTypeName').label('Type'),
                ]),
            nga.field('testWeapons', 'embedded_list').label('Test Weapons')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('item.definition.itemName').label('Name'),
                    nga.field('item.definition.tierTypeName').label('Tier'),
                    nga.field('item.definition.itemTypeName').label('Type'),
                ]),
        ]);
    
    return armsday;
}