export default function (nga, admin) {
    
    var vendors = admin.getEntity('vendors');
    
    vendors.identifier(nga.field('vendorHash'));
    
    vendors.url(function(entityName, viewType, identifierValue, identifierName) {
        return 'platformid/MyAccount/Character/characterid/Vendors/Summaries/';
    });
    
    vendors.readOnly();
    
    vendors.listView()
        .title('Vendors')
        .fields([
            nga.field('').label('').template('<img style="background-color:black;" width="48" height="48" src="http://www.bungie.net{{ entry.values[\'definition.summary.vendorIcon\']}}" />'),
            nga.field('definition.summary.vendorName').label('Name'),
            nga.field('enabled').label('Enabled'),
            nga.field('nextRefreshDate').label('Next Refresh'),
            //nga.field('').label('').template('<div> {{ entry.values }} </div>'),
//            nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" filter="{ platformid: entry.values[\'userInfo.membershipType\'], memberid:entry.values[\'userInfo.membershipId\'] }" href="#/platformid/MyAccount/Character/vendorid/"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Items</a>'),
            nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="vendoritems" filter="{ platformid: entry.values.membershipType, characterid:entry.values.characterId, vendorid:entry.values.vendorHash }" label="Items" size="sm"></ma-filtered-list-button>'),
            
            ])
        .actions(['back','export'])
        .perPage(50)
        .batchActions([]);
    
    return vendors;
    
}

    