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
        nga.field('primaryStat.value').label('Light'),
        nga.field('definition.talentGridHash').label('Light'),
        nga.field('definition.itemName').label('Name'),
        nga.field('definition.itemTypeName').label('Type'),
        nga.field('definition.tierTypeName').label('Tier'),
        //nga.field('talentGrid.nodes').label('talentGrid'),
//        nga.field('talentGrid.nodes', 'embedded_list').label('Nodes')
//                .targetFields([ 
//                        nga.field('nodeIndex'),
//                        nga.field('steps', 'embedded_list').label('steps')
//                            .targetFields([ 
//                                    nga.field('nodeStepName'),
//                                    nga.field('nodeStepDescription'),
//                                ])
//                    ]),
        nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/inventory/show/{{entry.values.currentPlatformId}}-{{entry.values.currentMemberId}}-{{entry.values.currentCharacterId}}-{{entry.values.itemId}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
        //nga.field('').template('<div>{{ entry.values }}</div>')
        ])
    .actions(['back','export'])
    .perPage(200)
    .batchActions([]);
    
    return vault;
    
}
