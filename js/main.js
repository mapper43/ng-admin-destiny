// require('ng-admin'); removed here and added back as a <script> tag to hep debugging - WebPack doesn't properly handle sourcemaps of dependencies yet

var myApp = angular.module('myApp', ['ng-admin']);

// custom API flavor
var apiFlavor = require('./api_flavor');


myApp.controller('BungieRedirect', function($scope,$location) {
    $scope.goBungie = function() {
        chrome.tabs.create({ url: "http://www.bungie.net" });
    };
    $scope.refreshPage = function() {
        chrome.tabs.getSelected(null, function(tab) {
            
            chrome.tabs.update(tab.id,{'url':'index.html#/dashboard'});
            
        });
    };
});

var chart = require('chart');
var chartjs = require('angular-chartjs');
////
//myApp.controller('StackedBarCtrl', function ($scope) {
//    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//    $scope.type = 'StackedBar';
//
//    $scope.data = [
//      [65, 59, 90, 81, 56, 55, 40],
//      [28, 48, 40, 19, 96, 27, 100]
//    ];
//  });

myApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
]);


myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope,$window) {
        return {
            request: function(config) {
                
                if (config.params && config.params.filter){
                    if (config.params.filter.categories) {
                        config.url=config.url + '/?categories='+config.params.filter.categories;
                    }
                    if (config.params.filter.displayname) {
                        config.url =config.url.replace('0', config.params.filter.displayname);
                    }
                    if (config.params.filter.unique_id) {
                        var arr = config.params.filter.unique_id.split('-');
                        config.url = config.url.replace('platformid',arr[0]);
                        config.url = config.url.replace('memberid',arr[1]);
                        config.url = config.url.replace('characterid',arr[2]);
                    }
                    if (config.params.filter.platformid) {
                        config.url =config.url.replace('platformid', config.params.filter.platformid);

                    }
                    if (config.params.filter.memberid) {
                        config.url =config.url.replace('memberid', config.params.filter.memberid);

                    }
                    if (config.params.filter.characterid) { 
                        config.url =config.url.replace('characterid', config.params.filter.characterid);
                    }
                    if (config.params.filter.vendorid) { 
                        config.url =config.url.replace('vendorid', config.params.filter.vendorid);
                    }
                    if (config.params.filter.activityid) { 
                        config.url =config.url.replace('activityid', config.params.filter.activityid);
                    }
                    if (config.url.indexOf('manifest-')>-1){
                        config.url = config.url.replace('manifest-','manifest/') + '/';
                    }
                    if (config.params && config.params.filter)
                        delete config.params.filter;

                }
                return config;
            },
        };
    });
}]);

myApp.config(['RestangularProvider', apiFlavor.requestInterceptor]);
myApp.config(['RestangularProvider', apiFlavor.responseInterceptor]);

myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create the admin application
    var admin = nga.application('ng-admin-destiny')
        .baseApiUrl('https://www.bungie.net/Platform/Destiny/');

    
    // add entities
    admin.addEntity(nga.entity('guardians'));
    admin.addEntity(nga.entity('characters'));
    admin.addEntity(nga.entity('charactersummary'));
    admin.addEntity(nga.entity('inventory'));
    admin.addEntity(nga.entity('activities'));
    admin.addEntity(nga.entity('carnagereport'));
    admin.addEntity(nga.entity('stats'));
    admin.addEntity(nga.entity('triumphs'));
    admin.addEntity(nga.entity('progression'));
    admin.addEntity(nga.entity('items'));
    admin.addEntity(nga.entity('nightfall'));
    admin.addEntity(nga.entity('heroicstrike'));
    admin.addEntity(nga.entity('dailychapter'));
    admin.addEntity(nga.entity('dailycrucible'));
    admin.addEntity(nga.entity('weeklycrucible'));
    admin.addEntity(nga.entity('arena'));
    admin.addEntity(nga.entity('armsday'));
    admin.addEntity(nga.entity('availablebounties'));
    admin.addEntity(nga.entity('myaccount'));
    admin.addEntity(nga.entity('vault'));
    admin.addEntity(nga.entity('vaultitem'));
    admin.addEntity(nga.entity('vendors'));
    admin.addEntity(nga.entity('vendoritems'));
    
    // configure entities
    require('./components/guardians/config')(nga, admin);
    require('./components/characters/config')(nga, admin);
    require('./components/charactersummary/config')(nga, admin);
    require('./components/inventory/config')(nga, admin);
    require('./components/activities/config')(nga, admin);
    require('./components/carnagereport/config')(nga, admin);
    require('./components/stats/config')(nga, admin);
    require('./components/triumphs/config')(nga, admin);
    require('./components/progression/config')(nga, admin);
    require('./components/items/config')(nga, admin);
    require('./components/nightfall/config')(nga, admin);
    require('./components/heroicstrike/config')(nga, admin);
    require('./components/dailychapter/config')(nga, admin);
    require('./components/dailycrucible/config')(nga, admin);
    require('./components/weeklycrucible/config')(nga, admin);
    require('./components/arena/config')(nga, admin);
    require('./components/armsday/config')(nga, admin);
    require('./components/availablebounties/config')(nga, admin);
    require('./components/myaccount/config')(nga, admin);
    require('./components/vault/config')(nga, admin);
    require('./components/vaultitem/config')(nga, admin);
    require('./components/vendors/config')(nga, admin);
    require('./components/vendoritems/config')(nga, admin);
    
    admin.dashboard(require('./components/dashboard/config')(nga, admin));
    admin.header(require('./header.html'));
    admin.menu(require('./menu')(nga, admin));

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
    
    
}]);
