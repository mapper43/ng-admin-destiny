export default function (nga, admin) {
    
    var myaccount = admin.getEntity('myaccount');
    
    myaccount.url(function(entityName, viewType, identifierValue, identifierName) {
      return 'https://www.bungie.net/Platform/User/GetCurrentBungieAccount/';
        
    });
    
    myaccount.listView()
        .title('My Account')
        .fields([
        
                nga.field('entry.values.message').label('')
                    .template('<span ng-if="entry.values.message">Login to <a target="_blank" href="{{ value }}">bungie.net</a></span>'),
                nga.field('').label('')
                    .template('<img  ng-if="entry.values[\'userInfo.iconPath\']" src="http://www.bungie.net{{ entry.values[\'userInfo.iconPath\'] }}" height="42" width="42" />'),
                nga.field('userInfo.displayName').label('Name'),
                nga.field('grimoireScore').label('Grimoire Score'),
                nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="vault" filter="{ platformid: entry.values[\'userInfo.membershipType\'], memberid:entry.values[\'userInfo.membershipId\'] }" size="sm"></ma-filtered-list-button>'),
                //nga.field('').label('').template("<div> {{ entry.values }} </div>"),
        ])
    .actions(['back'])
    .batchActions([]);
    
    return myaccount;
    
}
