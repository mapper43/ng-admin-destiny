export default function (nga, admin) {
    
    var availablebounties = admin.getEntity('availablebounties');
    
    availablebounties.identifier(nga.field('activityHash'));
    
    availablebounties.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
        
    });
    
    availablebounties.readOnly();
    
    availablebounties.showView()
        .title('Available Bounties')
        .fields([
            nga.field('saleItems', 'embedded_list').label('')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('item.definition.itemName').label('Name'),
                    nga.field('item.definition.itemDescription').label('Description'),
                ]),
         ]);
    
    return availablebounties;
}