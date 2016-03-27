// declare a new module called 'myApp', and make it require the `ng-admin` module as a dependency
var myApp = angular.module('myApp', ['ng-admin']);

var currentPlatformId;
var currentMemberId;
var currentCharacterId;

var urlShowArg;
myApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
])

// declare a function to run when the module bootstraps (during the 'config' phase)
.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('ng-admin-destiny').baseApiUrl('https://www.bungie.net/Platform/Destiny/');
    
    // **********************
    //  Xur
    // **********************
    
    var vendorXur = nga.entity('xur').identifier(nga.field('vendorHash')).url(function(entityName, entityId, viewType, identifierValue, identifierName) {
      return 'Advisors/Xur/';
    });
    
    vendorXur.readOnly();
    admin.addEntity(vendorXur);
    
    vendorXur.showView()
        .title('Xur')
        .actions(['back'])
        .fields([
            nga.field('nextRefreshDate').label('Next Refresh'),
            nga.field('enabled'),
            nga.field('saleItemCategories', 'embedded_list').label('')
                .targetFields([
                    nga.field('categoryTitle'),
                    nga.field('saleItems', 'embedded_list').label('')
                        .targetFields([
                            nga.field('item.definition.icon').label('').template('<img style="height:42px;width:42px;" src="https://www.bungie.net{{ entry.values[\'item.definition.icon\'] }}" />'), 
                            nga.field('item.primaryStat.value').label(''),
                            nga.field('item.definition.itemName').label('Name'),
                            
                            nga.field('item.perks', 'embedded_list').label('Perks')
                                .targetFields([
                                    nga.field('iconPath').label('').template('<img style="background-color:darkgray;height:42px;width:42px;" src="https://www.bungie.net{{ value }}" />'), 
                                    nga.field('definition.displayName').label('Name'),
                                    nga.field('definition.displayDescription').label('Description'),
                                    //nga.field('').label('all').template('<div> {{ entry.values }}</div>'),
                                    
                                    ]),
                            //nga.field('item.definition.icon'),
                        ]),
            ])
        ]);
    
    
    // **********************
    //  mainfest activities
    // **********************
    
    var manifestActivity = nga.entity('manifest-1').identifier(nga.field('requestedId')); //.baseApiUrl('https://www.bungie.net/Platform/Destiny/Manifest/1/')
    
    manifestActivity.readOnly();
    admin.addEntity(manifestActivity);
    
    manifestActivity.showView()
        .title('Activity Detail')
        .actions(['back'])
        .fields([
            //nga.field('requestedId'),
            nga.field('activity.activityName').label('Name'),
            nga.field('activity.activityDescription').label('Description'),
        ]);
    
    // ************************
    //  mainfest destinations
    // ************************
    
    var manifestDestination = nga.entity('manifest-14').identifier(nga.field('requestedId')); //.baseApiUrl('https://www.bungie.net/Platform/Destiny/Manifest/1/')
    
    manifestDestination.readOnly();
    admin.addEntity(manifestDestination);
    
    manifestDestination.showView()
        .title('Destination Details')
        .actions(['back'])
        .fields([
            //nga.field('requestedId'),
            nga.field('destination.destinationName').label('Name'),
            nga.field('destination.destinationDescription').label('Description'),
        ]);
    
    // ***************************
    //  mainfest inventory items
    // ***************************
    
    var manifestInventoryItem = nga.entity('manifest-6').identifier(nga.field('requestedId')); //.baseApiUrl('https://www.bungie.net/Platform/Destiny/Manifest/1/')
    
    manifestInventoryItem.readOnly();
    
    admin.addEntity(manifestInventoryItem);
    
    manifestInventoryItem.showView()
        .title('Item Details')
        .actions(['back'])
        .fields([
            nga.field('icon').label('').template('<img src="https://www.bungie.net{{ entry.values[\'inventoryItem.icon\'] }}" />'),   
            //nga.field('requestedId'),
            nga.field('inventoryItem.itemName').label('Name'),
            nga.field('inventoryItem.itemDescription').label('Description'),
            nga.field('inventoryItem.tierTypeName').label('Tier'),
            nga.field('inventoryItem.itemTypeName').label('Type'),
            ]);
    
    // *****************
    //  all items
    // *****************
    
    var item = nga.entity('items').identifier(nga.field('itemHash')).url(function(entityName, entityId, viewType, identifierValue, identifierName) {
      //console.log(identifierName);
      return 'Explorer/Items/';
    });
    
    admin.addEntity(item);
    
    item.listView()
    .title('Items')    
    .fields([
        nga.field('icon').label('').template('<img src="http://www.bungie.net{{ entry.values.icon }}" height="42" width="42" />'),        
        nga.field('itemName').label('Name'),
        //nga.field('itemDescription').label('Description'),
        nga.field('itemTypeName').label('Type'),
        nga.field('tierTypeName').label('Tier'),
        nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/manifest-6/show/{{entry.values.itemHash}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
    ])
    .perPage(50)
    .filters([
      nga.field('categories'),
      ])
    .actions(['back', 'export'])
    .batchActions([]);
    
    
    item.showView()  
    .fields([
        nga.field('icon').label('').template('<img src="http://www.bungie.net{{ entry.values.icon }}" height="42" width="42" />'),        
        nga.field('itemName').label('Name'),
        nga.field('itemDescription').label('Description'),
        nga.field('itemTypeName').label('Type'),
        nga.field('tierTypeName').label('Tier')
    ]);
    
    admin.dashboard(nga.dashboard()
    );
     
    //*********************************
    //  Advisor (Available Bounties)
    //*********************************
    var availableBounty = nga.entity('availablebounties').url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
    });
    availableBounty.readOnly();
    availableBounty.showView()
        .title('Available Bounties')
        .fields([
            nga.field('saleItems', 'embedded_list').label('')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('item.definition.itemName').label('Name'),
                    nga.field('item.definition.itemDescription').label('Description'),
                ]),
         ]);
    admin.addEntity(availableBounty);
    
    //*********************************
    //  Advisor (Arena)
    //*********************************
    var arena = nga.entity('arena').identifier(nga.field('activityHash')).url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
    });
    arena.readOnly();
    arena.listView()
        .title('Arena')
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
    admin.addEntity(arena);
    
    //************************
    //  Advisor (Armsday)
    //************************
    var armsday = nga.entity('armsday').url(function(entityName, viewType, identifierValue, identifierName) {
        return 'advisors/';
    });
    armsday.readOnly();
    armsday.showView()
        .title('Arms Day')
        .fields([
            nga.field('active'),
            nga.field('startDate'),
            nga.field('endDate'),
            nga.field('nextStartDate'),
            nga.field('canPlaceOrder'),
            nga.field('orders', 'embedded_list').label('Orders')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    //nga.field('item.itemHash').label('Name'),
                    nga.field('item.definition.itemName').label('Name'),
                    //nga.field('item.definition.itemDescription').label('Description'),
                    nga.field('item.definition.tierTypeName').label('Tier'),
                    nga.field('item.definition.itemTypeName').label('Type'),
                ]),
            nga.field('testWeapons', 'embedded_list').label('Test Weapons')
                .targetFields([
                    nga.field('item.definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    //nga.field('item.itemHash').label('Name'),
                    nga.field('item.definition.itemName').label('Name'),
                    //nga.field('item.definition.itemDescription').label('Description'),
                    nga.field('item.definition.tierTypeName').label('Tier'),
                    nga.field('item.definition.itemTypeName').label('Type'),
                ]),
        ]);
    admin.addEntity(armsday);
    
    
    //*********************************
    //  Advisor (Other Activities)
    //*********************************
    var advisor = nga.entity('advisors').identifier(nga.field('activityHash')).url(function(entityName, viewType, identifierValue, identifierName) {
        //console.log(identifierValue);
        urlShowArg = identifierValue;
        return 'advisors/';
    });
    advisor.readOnly();
    
    advisor.showView()
        .title('Activity')
        .fields([
            nga.field('').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ entry.values.iconPath }}" height="84" width="84" />'),
            nga.field('definition.activityName').label('Name'),
            nga.field('definition.activityDescription').label('Description'),
            nga.field('definition.minParty').label('Min Party'),
            nga.field('definition.maxParty').label('Max Party'),
            nga.field('definition.rewards', 'embedded_list').label('Rewards')
                .targetFields([
                    nga.field('definition.icon').label('').template('<img style="background-color:black;padding:5px;" src="http://www.bungie.net{{ value }}" height="42" width="42" />'),
                    nga.field('definition.itemName').label('Name'),
                    nga.field('definition.tierTypeName').label('Tier'),
                    nga.field('definition.value').label('Value'),
                ]),
            //nga.field('').label('all').template('<div> {{ entry.values }}</div>'),
        ]);
    
    admin.addEntity(advisor);
    
   
    
    //***********************
    // guardians
    //***********************
    var guardian = nga.entity('guardians').url(function(entityName, viewType, identifierValue, identifierName) {
      return 'SearchDestinyPlayer/All/0/';
    });
    
    guardian.listView()
        .title('Guardian Search')
        .fields([
            nga.field('iconPath').label('').template('<img src="http://www.bungie.net{{ entry.values.iconPath }}" height="42" width="42" />'),
            nga.field('displayName').label('Display Name'),
            //nga.field('', 'template').label('').template('<span class="pull-right"><a href="#/characters/list">Show</a>'),
            nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="characters" filter="{ platformid: entry.values.membershipType, memberid:entry.values.membershipId }" size="sm"></ma-filtered-list-button>'),
            nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="triumphs" filter="{ platformid: entry.values.membershipType, memberid:entry.values.membershipId }" size="sm"></ma-filtered-list-button>'),
        ])
    .filters([
      nga.field('displayname').label('').attributes({'placeholder': 'Display name'}).pinned(true),
      ])
    .actions(['back']) //'delete','create','edit', 'list', 'show','batch'
    .batchActions([]);
    
    admin.addEntity(guardian);
    
    // **********************
    //  guardians triumphs
    // **********************
    
    var triumph = nga.entity('triumphs')
    .identifier(nga.field('triumphSetHash'))
    .url(function(entityName, viewType, identifierValue, identifierName) {
            return 'platformid/Account/memberid/Triumphs/';
    });
    triumph.readOnly();
    
    triumph.listView()
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
        .batchActions([]);
    admin.addEntity(triumph);
    
    
    //***********************
    // guardian characters
    //***********************
    
    var character = nga.entity('characters').identifier(nga.field('characterBase.characterId')).url(function(entityName, viewType, identifierValue, identifierName) {
      return 'platformid/Account/memberid/Summary/';
    });
    
    character.listView()
    .title('Characters')   
    .fields([
        nga.field('emblemPath').label('').template('<img src="http://www.bungie.net{{ entry.values.emblemPath }}" height="42" width="42" />'),
        nga.field('characterBase.powerLevel').label('Light'),
        nga.field('characterBase.classDef.className').label('Class'),
        //nga.field('characterBase.characterId').label('id'),
        nga.field('characterBase.minutesPlayedTotal').label('Minutes Played'),
        nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="inventory" filter="{platformid: entry.values[\'characterBase.membershipType\'],memberid:entry.values[\'characterBase.membershipId\'],characterid: entry.values[\'characterBase.characterId\']}" size="sm"></ma-filtered-list-button>'),
        nga.field('', 'template').label('').template('<ma-filtered-list-button entity-name="progression" filter="{platformid: entry.values[\'characterBase.membershipType\'],memberid:entry.values[\'characterBase.membershipId\'],characterid: entry.values[\'characterBase.characterId\']}" size="sm"></ma-filtered-list-button>'),
        ])
    .actions(['back','export'])
    .batchActions([]);
    
    admin.addEntity(character);
    
    //*****************************
    // character progression
    //****************************
    
    var progression = nga.entity('progression')
        .identifier(nga.field('progressionHash'))
        .url(function(entityName, viewType, identifierValue, identifierName) {
            if (identifierValue)
                return 'platformid/Account/memberid/Character/characterid/Progression/'+ identifierValue;
            else
                return 'platformid/Account/memberid/Character/characterid/Progression/';
        });
    
    progression.listView()
    .title('Progression')
    .fields([
        nga.field('definition.icon').label('').template('<img src="http://www.bungie.net{{ value }}" style="background-color:darkgray;" height="42" width="42" />'),
        nga.field('definition.name').label('Name'),
        //nga.field('dailyProgress').label('Daily'),
        //nga.field('weeklyProgress').label('Weekly'),
        nga.field('currentProgress').label('Progress'),
        nga.field('level').label('Level'),
        //nga.field('').label('all').template('<div> {{ entry.values }}</div>'),
     ])
    .perPage(100)
    .batchActions([]);
    
    admin.addEntity(progression);
       
    
    //*****************************
    // character items
    //****************************
    
    var characterItem = nga.entity('inventory')
    .identifier(nga.field('itemHash'))
    .url(function(entityName, viewType, identifierValue, identifierName) {
        if (identifierValue)
            return 'platformid/Account/memberid/Character/characterid/Inventory/'+ identifierValue;
        else
            return 'platformid/Account/memberid/Character/characterid/Inventory/';
    });
    characterItem.readOnly();
    
    characterItem.listView()
    .title('Inventory')
    .fields([
        nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'definition.icon\'] }}" height="42" width="42" />'),
        //nga.field('itemHash').label('itemHash'),
        nga.field('primaryStat.value').label(''),
        nga.field('definition.itemName').label('Name'),
        nga.field('definition.tierTypeName').label('Tier'),
        nga.field('definition.itemTypeName').label('Type'),
        nga.field('', 'template').label('').template('<span class="pull-right"><a class="btn btn-default btn-xs" href="#/inventory/show/{{entry.values.currentPlatformId}}-{{entry.values.currentMemberId}}-{{entry.values.currentCharacterId}}-{{entry.values.itemInstanceId}}"><span class="glyphicon glyphicon-eye-open"></span>&nbsp;Details</a>'),
        ])
    //.actions(['back','export'])
    .batchActions([]);
    
    characterItem.showView()
        .title('Inventory Item Detail')
        .actions(['back'])
        .fields([
            nga.field('').label('').template('<img src="http://www.bungie.net{{ entry.values[\'itemDef.icon\'] }}" height="84" width="84" />'),
            nga.field('itemDef.itemName').label('Name'),
            nga.field('itemDef.itemDescription').label('Description'),
            nga.field('primaryStat.value').label('Light'),
            nga.field('perks', 'embedded_list').label('Perks')
                .targetFields([ 
                    nga.field('perkHash').label('').template('<img style="background-color:gray" src="http://www.bungie.net{{ entry.values.iconPath }}" height="42" width="42" />'),
                    nga.field('perkDef.displayName').label('Name'),
                    nga.field('perkDef.displayDescription').label('Description'),
                ])
        ]);    
    
    admin.addEntity(characterItem);
    
    
    admin.menu(nga.menu()
      .addChild(nga.menu().title('Current Activities')
            .addChild(nga.menu().title('Nightfall').link("/advisors/show/nightfall"))
            .addChild(nga.menu().title('Heroic Strike').link("/advisors/show/heroicStrike"))
            .addChild(nga.menu().title('Arena').link("/arena/list"))
            .addChild(nga.menu().title('Daily Chapter').link("/advisors/show/dailyChapter"))
            .addChild(nga.menu().title('Daily Crucible').link("/advisors/show/dailyCrucible"))
            .addChild(nga.menu().title('Arms Day').link("/armsday/show/"))
            .addChild(nga.menu().title('Weekly Crucible').link("/advisors/show/weeklyCrucible"))
            .addChild(nga.menu().title('Available Bounties').link("/availablebounties/show/")))
      .addChild(nga.menu(admin.getEntity('guardians')).title('Guardian Search'))
      .addChild(nga.menu().title('Vendors')
            .addChild(nga.menu().title('Xur').link("/xur/show/")))
      .addChild(nga.menu().title('All Items by Category')
            .addChild(nga.menu().title('Primary Weapons').link("/items/list?search=%7B%22categories%22:%221%22%7D"))
            .addChild(nga.menu().title('Currency').link("/items/list?search=%7B%22categories%22:%2218%22%7D"))
            .addChild(nga.menu().title('Armor').link("/items/list?search=%7B%22categories%22:%2220%22%7D"))
            .addChild(nga.menu().title('Warlock Class').link("/items/list?search=%7B%22categories%22:%2221%22%7D"))
            .addChild(nga.menu().title('Titan Class').link("/items/list?search=%7B%22categories%22:%2222%22%7D"))
            .addChild(nga.menu().title('Hunter Class').link("/items/list?search=%7B%22categories%22:%2223%22%7D"))
            .addChild(nga.menu().title('Crucible').link("/items/list?search=%7B%22categories%22:%2228%22%7D"))
            .addChild(nga.menu().title('Material').link("/items/list?search=%7B%22categories%22:%2240%22%7D"))
            .addChild(nga.menu().title('Shader').link("/items/list?search=%7B%22categories%22:%2241%22%7D"))
            .addChild(nga.menu().title('Ship').link("/items/list?search=%7B%22categories%22:%2242%22%7D"))
            .addChild(nga.menu().title('Vehicle').link("/items/list?search=%7B%22categories%22:%2243%22%7D"))
            .addChild(nga.menu().title('Emote').link("/items/list?search=%7B%22categories%22:%2244%22%7D"))
            .addChild(nga.menu().title('Chest Armor').link("/items/list?search=%7B%22categories%22:%2247%22%7D"))
            .addChild(nga.menu().title('Build').link("/items/list?search=%7B%22categories%22:%2250%22%7D"))
            .addChild(nga.menu().title('Inventory').link("/items/list?search=%7B%22categories%22:%2252%22%7D")))
    );

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            request: function(config) {
                
                console.log(config.params);
                
                if (config.params && config.params.displayname) {  
                    config.url =config.url.replace('0', config.params.displayname);
                    delete config.params.displayname;
                }
                if (config.params && config.params.platformid && config.params.memberid) { 
                    config.url =config.url.replace('platformid', config.params.platformid).replace('memberid', config.params.memberid);
                    currentPlatformId = config.params.platformid;
                    currentMemberId = config.params.memberid
                    
                    delete config.params.platformid;
                    delete config.params.memberid;
                }
                
                
                if (config.params && config.params.characterid) {
                    currentCharacterId = config.params.characterid;
                    
                    config.url =config.url.replace('platformid', config.params.platformid).replace('memberid', config.params.memberid).replace('characterid',config.params.characterid);
                    delete config.params.platformid;
                    delete config.params.memberid;
                    delete config.params.characterid;
                    delete config.params.page;
                    //delete config.params.definitions;
                    delete config.params.count;
                }
                
                if (config.url.toLowerCase().indexOf('/platformid/account/memberid/character/characterid/inventory/')>-1){
                    var argstring = config.url.split('/').pop();
                    var arr = argstring.split('-');
                    
                    config.url = config.url
                                    .replace('platformid',arr[0])
                                    .replace('memberid',arr[1])
                                    .replace('characterid',arr[2])
                                    .replace(argstring,arr[3]) + '/';
                    
                    
                    
                }
                if (config.url.indexOf('manifest-')>-1){
                    config.url = config.url.replace('manifest-','manifest/') + '/';
                }
                
                return config;
            },
        };
    });
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.setDefaultHeaders({'X-API-Key': 'YOUR_API_KEY'});
    
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
        
        if (operation == "get") {
            params.definitions = true;
            
        }
        if (operation == "getList") {
            params.definitions = true;
            if (what=='items'){
                params.order='Rarity';
                params.direction='Descending';
            }
            
            // custom pagination params
            if (params._page) {
                params.page=params._page-1;
                params.count = params._perPage;
                //params._start = (params._page - 1) * params._perPage;
                //params._end = params._page * params._perPage;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                //params._sort = params._sortField;
                //params._order = params._sortDir;
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                //console.log(params._filters);
                
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
            
            if (what=='guardians'){
                delete params.count;
                delete params.definitions;
                delete params.page;
            }
            if (what=='triumphs'){
                //delete params.count;
                delete params.page;
            }
            if (what=='progression'){
                delete params.count;
                delete params.page;
            }
        }
        console.log(params);
        
        return { params: params };
    });
    
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response,params,headers) {
        
        if (operation == "getList" && (what == "items")) {
            //added to handle multipage response from bungie api
            var totalResults = data.Response.data.totalResults;
            response.totalCount=totalResults;
            
            if (what=="items"){
                var arr = Object.keys(data.Response.definitions.items).map(function (key) {return data.Response.definitions.items[key]});
                console.log(arr);
                
                data = arr;
            }
            
        }
        if (operation == "getList" && what == "activities") {
            var arr = Object.keys(data.Response.definitions.activities).map(function (key) {return data.Response.definitions.activities[key]});
            data = arr;
        }
        if (operation == "get" && what == "activities") {
            if (data && data.Response && data.Response.data){
                data = data.Response.data.activity;
            } else {
                data = [];
            }
            
        }
        if (operation == "get" && what=="xur") {
            if (data && data.Response && data.Response.data){
                var categories = data.Response.data.saleItemCategories;
                for (var i=0; i<categories.length; i++){
                    var items = categories[i].saleItems;
                    for (var j=0; j<items.length; j++){
                        items[j].item.definition = data.Response.definitions.items[items[j].item.itemHash];
                        if (items[j].item && items[j].item.perks){
                            var perks = items[j].item.perks;
                            for (var k=0; k<perks.length; k++){
                                //console.log(perks[k]);
                                perks[k].definition = data.Response.definitions.perks[perks[k].perkHash];
                            }
                        }
                    }
                }
                data = data.Response.data;
            } else {
                data = [];
            }   
        }
        if (operation == "get" && what.indexOf("manifest-")>-1) {
            if (data && data.Response && data.Response.data){
                data = data.Response.data;
            } else {
                data = [];
            }
            
        }
        if (operation == "getList" && what == "destinations") {
            var arr = Object.keys(data.Response.definitions.destinations).map(function (key) {return data.Response.definitions.destinations[key]});
            data = arr;
        }
        if (operation == "getList" && what == "advisorItems") {
            var arr = Object.keys(data.Response.definitions.items).map(function (key) {return data.Response.definitions.items[key]});
            data = arr;
        }
        if (operation == "getList" && what=="arena") {
            var arr = Object.keys(data.Response.data.arena).map(function (key) {return data.Response.data.arena[key]});
            
            for (var i=0; i<arr.length; i++){
                arr[i].definition = data.Response.definitions.activities[arr[i].activityHash];
            }
            data=arr;   
        }
        if (operation == "get" && what=="availablebounties") {
            var arr = Object.keys(data.Response.data.availableBounties).map(function (key) {return data.Response.data.availableBounties[key]});
            var saleItems = arr[0].saleItems;
            
            for (var i=0; i<arr[0].saleItems.length; i++){
                arr[0].saleItems[i].item.definition = data.Response.definitions.items[arr[0].saleItems[i].item.itemHash];
            }
            
            data=arr[0];
        }
        if (operation == "get" && what=="armsday") {
            for (var i=0; i<data.Response.data.armsDay.orders.length; i++){
                data.Response.data.armsDay.orders[i].item.definition = data.Response.definitions.items[data.Response.data.armsDay.orders[i].item.itemHash];
            }
            for (var i=0; i<data.Response.data.armsDay.testWeapons.length; i++){
                data.Response.data.armsDay.testWeapons[i].item.definition = data.Response.definitions.items[data.Response.data.armsDay.testWeapons[i].item.itemHash];
            }
            data = data.Response.data.armsDay;
        }
        if (operation == "get" && what=="advisors") {
            var actId = urlShowArg;
            var actBundleHash;
            
            if (actId=='weeklyCrucible'){
                data.Response.data[actId]= data.Response.data[actId][0]; 
                actBundleHash = data.Response.data[actId].activityBundleHash;
                data.Response.data[actId].definition=data.Response.definitions.activityBundles[actBundleHash];
            } else {
                actBundleHash = data.Response.data[actId].activityBundleHash;
                data.Response.data[actId].definition=data.Response.definitions.activities[actBundleHash];
            }
            
            if (actId!='weeklyCrucible'){
                var rewardDefs = data.Response.data[actId].definition.rewards;

                for (var i=0; i<rewardDefs.length; i++){
                    data.Response.data[actId].definition.rewards[i].definition = data.Response.definitions.items[rewardDefs[i].rewardItems[0].itemHash];
                    data.Response.data[actId].definition.rewards[i].definition.value = rewardDefs[i].rewardItems[0].value;
                }
            }
            
            data = data.Response.data[actId];
        }
        if (operation == "getList" && what == "triumphs") {
            if (data){
                var triumphSets = data.Response.data.triumphSets;
                
                for (var i=0; i< triumphSets.length; i++){
                    var triumphs = triumphSets[i].triumphs;
                    var triumphSetHash = triumphSets[i].triumphSetHash;
                    data.Response.data.triumphSets[i].definition = data.Response.definitions.triumphs[triumphSetHash];
                    
                    for (var j=0; j<triumphs.length; j++){
                        
                        data.Response.data.triumphSets[i].triumphs[j].definition = 
                            data.Response.definitions.triumphs[triumphSetHash].triumphs[j];
                        
                    }
                }
                
                data = data.Response.data.triumphSets;
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what == "guardians") {
            if (data){
                data.Response.displayName = params.displayname;
                data = data.Response;
            } else {
                data = [];
            }
        }
        if (operation == "get" && what == "inventory") {
            var item = data.Response.data.item;
            item.itemDef = data.Response.definitions.items[item.itemHash];
            for (var i=0; i< item.perks.length; i++){
                item.perks[i].perkDef = data.Response.definitions.perks[item.perks[i].perkHash];
            }
            data = item;
        }
        
        if (operation == "getList" && what == "progression") {
            if (data) {
                var progressions = data.Response.data.progressions;
                
                for (var i=0; i<progressions.length; i++){
                    data.Response.data.progressions[i].definition = data.Response.definitions.progressions[progressions[i].progressionHash];
                    var name =  data.Response.data.progressions[i].definition.name.replace(/_/g,' ');
                    var upperName = name[0].toUpperCase() + name.slice(1);
                    data.Response.data.progressions[i].definition.name=upperName;
                }
                
                data = data.Response.data.progressions;
            } else {
                data = [];
            }
        }
            
        if (operation == "getList" && what == "inventory") {
            if (data) {
                var equippables = data.Response.data.buckets.Equippable;
                var arr = [];
                
                for (var i=0; i<equippables.length; i++){
                    var item = equippables[i].items[0];
                    if (item && item.itemHash) {
                        item.definition = data.Response.definitions.items[item.itemHash];
                        item.currentCharacterId=currentCharacterId;
                        item.currentPlatformId=currentPlatformId;
                        item.currentMemberId=currentMemberId;
                        arr.push(item);
                    }
                }
                
                console.log(arr);
                data=arr;
               
            }
            if (data && false){
                var allitems = [];
                
                var buckets = Object.keys(data.Response.data.buckets.Equippable).map(function (key) {return data.Response.data.buckets.Equippable[key]});
                
                var itemDefArray = data.Response.definitions.items;
                
                for (var i=0; i<buckets.length; i++){
                    var items = buckets[i].items;
                    for (var j=0; j<items.length; j++){
                        items[j].bucketHash = buckets[i].bucketHash;
                        items[j].itemDef = itemDefArray[items[j].itemHash];
                        items[j].currentCharacterId=currentCharacterId;
                        items[j].currentPlatformId=currentPlatformId;
                        items[j].currentMemberId=currentMemberId;
                        
                        if (allitems.indexOf(items[j])==-1) allitems.push(items[j]);
                    }
                }
                data = allitems;
            } else {
                //data = [];
            }
        }
        if (operation == "getList" && what == "characters") {
            var arr = Object.keys(data.Response.data.characters).map(function (key) {return data.Response.data.characters[key]});
            
            //inject itemdefs to character array
            var classesArray = data.Response.definitions.classes;
            //append itemdefs to character array
            for (var i=0; i< arr.length; i++){
                arr[i].characterBase.classDef = classesArray[arr[i].characterBase.classHash];
            }
            data = arr;
        }
        return data;
    });
}]);

//// @see https://github.com/mgonto/restangular/issues/603
//myApp.config(function($httpProvider) {
//    $httpProvider.interceptors.push(function() {
//        return {
//            request: function(config) {
//                var pattern = /\/(\d+)$/;
//                console.log(config.url);
//                
//                if (pattern.test(config.url)) {
//                    config.params = config.params || {};
//                    config.params['id'] = pattern.exec(config.url)[1];
//                    config.url = config.url.replace(pattern, '');
//                }
//
//                return config;
//            },
//        };
//    });
//});
