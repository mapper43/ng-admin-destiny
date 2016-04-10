export default function (nga, admin) {
    
    var inventory = admin.getEntity('inventory');
    
    inventory.identifier(nga.field('itemHash'));
    
    inventory.url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue){
            var arr = identifierValue.split('-');
            return arr[0] + '/Account/' + arr[1] + '/Character/' + arr[2] + '/Inventory/' + arr[3] + '/';
        }else{
            return 'platformid/Account/memberid/Character/characterid/Inventory/';
        }
    });
    
    inventory.readOnly();
    
    inventory.listView()
        .title('Inventory')
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="48" width="48" />'),
            //nga.field('itemHash').label('itemHash'),
            nga.field('primaryStat.value').label('Light'),
            nga.field('definition.itemName').label('Name'),
            nga.field('definition.tierTypeName').label('Tier'),
            nga.field('definition.itemTypeName').label('Type'),
            nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/inventory/show/{{entry.values.currentPlatformId}}-{{entry.values.currentMemberId}}-{{entry.values.currentCharacterId}}-{{entry.values.itemInstanceId}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
            ])
        .actions(['back','export'])
        .batchActions([]);
    
    inventory.showView()
        .title('Item Detail')
        .actions(['back'])
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="96" width="96" />'),
            nga.field('definition.itemName').label('Name'),
            nga.field('definition.itemDescription').label('Description'),
            nga.field('primaryStat.value').label('Light'),
            nga.field('perks', 'embedded_list').label('Perks')
                .targetFields([ 
                    nga.field('').label('').template('<img style="background-color:gray" src="https://www.bungie.net{{ entry.values.iconPath }}" height="48" width="48" />'),
                    nga.field('definition.displayName').label('Name'),
                    nga.field('definition.displayDescription').label('Description'),
                ])
        ]);    
    
    
    return inventory;
    
}

    