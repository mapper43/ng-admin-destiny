export default function (nga, admin) {
    
    var inventory = admin.getEntity('inventory');
    
    inventory.identifier(nga.field('itemHash'));
    
    inventory.url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue)
            return 'platformid/Account/memberid/Character/characterid/Inventory/'+ identifierValue;
        else
            return 'platformid/Account/memberid/Character/characterid/Inventory/';
    });
    
    inventory.readOnly();
    
    inventory.listView()
        .title('Inventory')
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="42" width="42" />'),
            //nga.field('itemHash').label('itemHash'),
            nga.field('primaryStat.value').label(''),
            nga.field('definition.itemName').label('Name'),
            nga.field('definition.tierTypeName').label('Tier'),
            nga.field('definition.itemTypeName').label('Type'),
            nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/inventory/show/{{entry.values.currentPlatformId}}-{{entry.values.currentMemberId}}-{{entry.values.currentCharacterId}}-{{entry.values.itemInstanceId}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
            ])
        .actions(['back','export'])
        .batchActions([]);
    
    inventory.showView()
        .title('Inventory Item Detail')
        .actions(['back'])
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="84" width="84" />'),
            nga.field('definition.itemName').label('Name'),
            nga.field('definition.itemDescription').label('Description'),
            nga.field('primaryStat.value').label('Light'),
            nga.field('perks', 'embedded_list').label('Perks')
                .targetFields([ 
                    nga.field('').label('').template('<img style="background-color:gray" src="https://www.bungie.net{{ entry.values.iconPath }}" height="42" width="42" />'),
                    nga.field('definition.displayName').label('Name'),
                    nga.field('definition.displayDescription').label('Description'),
                ])
        ]);    
    
    
    return inventory;
    
}

    