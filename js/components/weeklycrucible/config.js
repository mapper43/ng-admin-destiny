export default function (nga, admin) {
    
    var weeklycrucible = admin.getEntity('weeklycrucible');
    
    weeklycrucible.identifier(nga.field('activityHash'));
    
    weeklycrucible.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
        
    });
    
    weeklycrucible.readOnly();
    
    weeklycrucible.showView()
        .title('Weekly Crucible')
        .actions(['back'])
        .fields([
            nga.field('definition.releaseIcon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="84" width="84" />'),
            nga.field('definition.activityName').label('Name'),
            nga.field('definition.activityDescription').label('Description'),
            //nga.field('').label('all').template('<div> {{ entry.values }}</div>'),
        ]);
    
    return weeklycrucible;
}