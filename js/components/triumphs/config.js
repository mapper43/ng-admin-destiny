export default function (nga, admin) {
    
    var triumphs = admin.getEntity('triumphs');
    
    triumphs.identifier(nga.field('triumphSetHash'));
    
    triumphs.url(function(entityName, viewType, identifierValue, identifierName) {
            return 'platformid/Account/memberid/Triumphs/';
    });
    
    triumphs.listView()
    .title('Triumphs')   
    .fields([
            nga.field('definition.title').label('Title'),
            nga.field('definition.incompleteDetails').label('Details').template('<div style="width:200px;"> {{ value }}" <div/>'),
            nga.field('triumphs', 'embedded_list').label('Triumphs')
                .targetFields([
                    nga.field('definition.iconPath').label('').template('<img style="width:21px;height:21px;background-color:darkgray;" src="https://www.bungie.net{{ value }}" />'),   
                    nga.field('definition.title').label('Title'),
                    nga.field('definition.hasProgress').label('Progress'),
                    nga.field('complete').label('Complete'),
                ])
        ])
        .actions(['back'])
        .batchActions([]);
    
    return triumphs;
    
}
