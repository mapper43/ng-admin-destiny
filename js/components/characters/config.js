import moment from 'moment';
import showTemplate from './showtemplate.html';

var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {
    
    var characters = admin.getEntity('characters');
    
    characters.identifier(nga.field('characterBase.characterId'));
    
    characters.url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue){
            var arr = identifierValue.split('-');
            return arr[0] + '/Account/' + arr[1] + '/Summary/';
        }else{
            return 'platformid/Account/memberid/Summary/';
        }
    });
    
    characters.listView()
    .title('Characters')   
    .fields([
        nga.field('emblemPath').label('').template('<img src="http://www.bungie.net{{ entry.values.emblemPath }}" height="42" width="42" />'),
        nga.field('characterBase.powerLevel').label('Light'),
        nga.field('characterBase.classDef.className').label('Class'),
        nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/charactersummary/show/{{entry.values[\'characterBase.membershipType\']}}-{{entry.values[\'characterBase.membershipId\']}}-{{entry.values[\'characterBase.characterId\']}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Summary</a>'),
        //nga.field('characterBase.currentActivityHash').label('Current Activity'),
        nga.field('', 'template').label('').template('<ma-filtered-list-button ng-if="entry.values[\'characterBase.currentActivityHash\']!=\'0\'" entity-name="carnagereport" filter="{ activityid: entry.values[\'characterBase.currentActivityHash\'] }" label="Current Activity" size="sm"></ma-filtered-list-button>'),
        //nga.field('characterBase.characterId').label('id'),
        nga.field('characterBase.minutesPlayedTotal').label('Minutes Played'),
        ])

    .actions(['back','export'])
    .batchActions([]);
    
    characters.showView()
    .title('Characters')   
    .fields([
        nga.field('characters', 'embedded_list').label('Characters')
            .targetFields([ 
                nga.field('characterBase.membershipType'),
                nga.field('characterBase.membershipId'),
                nga.field('characterBase.characterId'),
            ])
        ])
    .actions(['back']).template(showTemplate);
    
     
    return characters;
    
}
