export default function (nga, admin) {
    
    var vaultitem = admin.getEntity('vaultitem');
    
    vaultitem.identifier(nga.field('itemHash'));
    
    vaultitem.url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue)
            return 'Manifest/InventoryItem/'+ identifierValue;
        else
            return 'Manifest/InventoryItem/';
    });
    
    vaultitem.readOnly();
    
    vaultitem.showView()
        .title('Vault Item Detail')
        .actions(['back'])
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values.icon }}" height="96" width="96" />'),
            nga.field('itemName').label('Name'),
            nga.field('itemDescription').label('Description'),
            nga.field('primaryBaseStatHash').label('Light'),
//            nga.field('perkHashes'),
//            nga.field('perks', 'embedded_list').label('Perks')
//                .targetFields([ 
//                    nga.field('').template('<div> {{ entry.values }} </div>'),
//                ]),
//            nga.field('talentGridHash'),
//            nga.field('talentGrid.gridHash'),
            nga.field('talentGrid.nodes', 'embedded_list').label('Nodes')
                .targetFields([ 
                    //nga.field('').template('<div> {{ entry.values }} </div>'),
                    nga.field('steps', 'embedded_list').label('Steps')
                        .targetFields([ 
                            nga.field('').label('').template('<img style="background-color:darkgray;" src="http://www.bungie.net{{ entry.values.icon }}" height="24" width="24" />'),
                            nga.field('nodeStepName'),
                            nga.field('nodeStepDescription'),
//                            nga.field('perks', 'embedded_list').label('Perks')
//                            .targetFields([ 
//                                nga.field('displayIcon').label('').template('<img style="background-color:darkgray;" src="http://www.bungie.net{{ value }}" height="24" width="24" />'),
//                                nga.field('displayName'),
//                                nga.field('displayDescription'),
//                            ]),
                            //nga.field('').template('<div> {{ entry.values }} </div>'),
                        ]),
                ]),
            
        ]);    
    
    
    return vaultitem;
    
}

    