export default function (nga, admin) {
    
    var arena = admin.getEntity('arena');
    
    arena.identifier(nga.field('activityHash'));
    
    arena.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
        
    });
    
    arena.readOnly();
    
    arena.listView()
        .title('Arena')
        .actions(['back'])
        .fields([
            nga.field('iconPath').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
            //nga.field('activityHash').label('hash'),
            nga.field('bossFight').label('Boss Fight'),
            nga.field('isCompleted').label('Completed'),
            nga.field('definition.activityName').label('Name'),
            nga.field('definition.activityDescription').label('Description'),
            nga.field('definition.minParty').label('Min Party'),
            nga.field('definition.maxParty').label('Max Party'),
        
         ])
        .batchActions([]);
    
    return arena;
}