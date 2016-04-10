import moment from 'moment';
import charSummaryTemplate from './template.html';

var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {
    var charactersummary = admin.getEntity('charactersummary');
    
    charactersummary.identifier(nga.field('uniqueId'));
    
    //var platId,memId,charId;
    
    charactersummary.url(function(entityName, viewType, identifierValue, identifierName) {
        var arr = identifierValue.split('-');

        return arr[0] + '/Account/' + arr[1] + '/Character/' + arr[2] + '/';
        //return 'platformid/Account/memberid/Character/characterid/'+ identifierValue;
    });
    
    charactersummary.readOnly();
    
    charactersummary.showView()
        .template(charSummaryTemplate)
        .title('<h3>Character Summary</h3>')
        .actions(['back'])
        .fields([
            nga.field('inventory', 'referenced_list')
                .targetEntity(admin.getEntity('inventory'))
                .targetReferenceField('unique_id')
                .targetFields([
                    nga.field('unique_id'),
                ]),
                //.remoteComplete(true, {refreshDelay: 5000}),
            nga.field('backgroundPath'),
            nga.field('emblemPath'),
            nga.field('grimoireScore'),
            nga.field('characterBase.class.className'),
            nga.field('characterBase.race.raceName'),
            nga.field('characterBase.gender.genderName'),
            nga.field('characterLevel'),
            nga.field('characterBase.powerLevel'),
            nga.field('characterBase.minutesPlayedTotal'),
            nga.field('characterBase.currentActivityHash'),
            nga.field('characterBase.stats.STAT_DEFENSE.value'),
            nga.field('characterBase.stats.STAT_DEFENSE.definition.statDescription'),
            nga.field('characterBase.stats.STAT_INTELLECT.value'),
            nga.field('characterBase.stats.STAT_INTELLECT.definition.statDescription'),
            nga.field('characterBase.stats.STAT_DISCIPLINE.value'),
            nga.field('characterBase.stats.STAT_DISCIPLINE.definition.statDescription'),
            nga.field('characterBase.stats.STAT_STRENGTH.value'),
            nga.field('characterBase.stats.STAT_STRENGTH.definition.statDescription'),
            nga.field('characterBase.stats.STAT_LIGHT.value'),
            nga.field('characterBase.stats.STAT_LIGHT.definition.statDescription'),
            nga.field('characterBase.stats.STAT_ARMOR.value'),
            nga.field('characterBase.stats.STAT_ARMOR.definition.statDescription'),
            nga.field('characterBase.stats.STAT_AGILITY.value'),
            nga.field('characterBase.stats.STAT_AGILITY.definition.statDescription'),
            nga.field('characterBase.stats.STAT_RECOVERY.value'),
            nga.field('characterBase.stats.STAT_RECOVERY.definition.statDescription'),
            nga.field('characterBase.stats.STAT_OPTICS.value'),
            nga.field('characterBase.stats.STAT_OPTICS.definition.statDescription'),
            nga.field('characterBase.stats.STAT_ATTACK_SPEED.value'),
            nga.field('characterBase.stats.STAT_ATTACK_SPEED.definition.statDescription'),
            nga.field('characterBase.stats.STAT_DAMAGE_REDUCTION.value'),
            nga.field('characterBase.stats.STAT_DAMAGE_REDUCTION.definition.statDescription'),
            nga.field('characterBase.stats.STAT_ATTACK_EFFICIENCY.value'),
            nga.field('characterBase.stats.STAT_ATTACK_EFFICIENCY.definition.statDescription'),
            nga.field('characterBase.stats.STAT_ATTACK_ENERGY.value'),
            nga.field('characterBase.stats.STAT_ATTACK_ENERGY.definition.statDescription'),
            nga.field('characterBase.peerView.equipment', 'embedded_list').label('')
                    
                    .targetFields([ 
                        nga.field('').label('')
                    .template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="42" width="42" />'),
                        nga.field('primaryStat').label('Light'),
                        nga.field('definition.itemName').label('Name'),
                        nga.field('definition.itemTypeName').label('Type'),
                        
                        
                        ])
                    .sortField('primaryStat')
                    .sortDir('DESC'),
        ]);    
    
    return charactersummary;
    
}

    