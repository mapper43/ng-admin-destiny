export default function (nga, admin) {
    
    var heroicstrike = admin.getEntity('heroicstrike');
    
    heroicstrike.identifier(nga.field('activityHash'));
    
    heroicstrike.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
        
    });
    
    heroicstrike.readOnly();
    
    heroicstrike.showView()
        .title('Heroic Strike')
        .actions(['back'])
        .fields([
            nga.field('').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ entry.values.iconPath }}" height="84" width="84" />'),
            nga.field('definition.activityName').label('Name'),
            nga.field('definition.activityDescription').label('Description'),
            nga.field('definition.minParty').label('Min Party'),
            nga.field('definition.maxParty').label('Max Party'),
            nga.field('definition.rewards', 'embedded_list').label('Rewards')
                .targetFields([
                    nga.field('definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('definition.itemName').label('Name'),
                    nga.field('definition.tierTypeName').label('Tier'),
                    nga.field('definition.value').label('Value'),
                ]),
            //nga.field('').label('all').template('<div> {{ entry.values }}</div>'),
        ]);
    
    return heroicstrike;
}