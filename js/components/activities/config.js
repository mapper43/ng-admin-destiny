export default function (nga, admin) {
    
    var activities = admin.getEntity('activities');
    
    activities.identifier(nga.field('activityHash'));
    
    activities.url(function(entityName, viewType, identifierValue, identifierName) {
            return 'platformid/Account/memberid/Character/characterid/Activities/';
    });
    
    activities.listView()
    .title('Activities')   
    .fields([
            nga.field('definition.activityName').label('Name'),
            nga.field('definition.activityDescription').label('Description'),
            nga.field('isCompleted').label('Active'),
            nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="carnagereport" filter="{ activityid: entry.values.activityHash }" label="Carnage" size="sm"></ma-filtered-list-button>'),
            
        ])
        .perPage(500)
        .actions(['back'])
        .batchActions([]);
    
    return activities;
    
}
