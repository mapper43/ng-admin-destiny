export default function (nga, admin) {
    
    var progression = admin.getEntity('progression');
    
    progression.identifier(nga.field('progressionHash'));
    
    progression.url(function(entityName, viewType, identifierValue, identifierName) {
           if (identifierValue)
                return 'platformid/Account/memberid/Character/characterid/Progression/'+ identifierValue;
            else
                return 'platformid/Account/memberid/Character/characterid/Progression/';
    });
    
    progression.listView()
        .title('Progression')   
        .fields([
            //nga.field('definition.icon').label('').template('<img src="http://www.bungie.net{{ value }}" style="background-color:darkgray;" height="42" width="42" />'),
            nga.field('definition.name').label('Name'),
            nga.field('currentProgress').label('Progress'),
            nga.field('level').label('Level'),
         ])
        .perPage(100)
        .batchActions([]);
    
    return progression;
    
}