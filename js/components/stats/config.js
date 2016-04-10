export default function (nga, admin) {
    
    var stats = admin.getEntity('stats');
    
    stats.identifier(nga.field('keyval'));
    
    stats.url(function(entityName, viewType, identifierValue, identifierName) {
            return 'Stats/platformid/memberid/characterid/';
    });
    
    stats.listView()
    .title('Stats')   
    .fields([
            nga.field('keyval').label('Name'),
            nga.field('statsval.allTime.winLossRatio.basic.displayValue').label('Win/Loss'),
            nga.field('statsval.allTime.longestKillSpree.basic.displayValue').label('Longest Kill Spree'),
            nga.field('statsval.allTime.longestSingleLife.basic.displayValue').label('Longest Life'),
            nga.field('statsval.allTime.weaponBestType.basic.displayValue').label('Best Weapon'),
            nga.field('statsval.allTime.abilityKills.basic.value').label('Ability Kills'),
            nga.field('statsval.allTime.weaponKillsAutoRifle.basic.value').label('Auto Rifle'),
            nga.field('statsval.allTime.weaponKillsSuper.basic.value').label('Super'),
            nga.field('statsval.allTime.weaponKillsSword.basic.value').label('Sword'),
            nga.field('statsval.allTime.weaponKillsSideArm.basic.value').label('Side Arm'),
            nga.field('statsval.allTime.weaponKillsSniper.basic.value').label('Sniper'),
            //nga.field('statsval.allTime.weaponKillsSubmachinegun.basic.value').label('Submachine Gun'),
            nga.field('statsval.allTime.weaponKillsMachinegun.basic.value').label('Machine Gun'),
            nga.field('statsval.allTime.weaponKillsShotgun.basic.value').label('Shotgun'),
            nga.field('statsval.allTime.weaponKillsRelic.basic.value').label('Relic'),
            nga.field('statsval.allTime.weaponKillsScoutRifle.basic.value').label('Scout Rifle'),
            nga.field('statsval.allTime.weaponKillsPulseRifle.basic.value').label('Pulse Rifle'),
        
        ])
    .batchActions([])
    .perPage(200)
    .actions(['back']);
    
    return stats;
    
}
