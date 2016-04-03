var moment = require('moment');
var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {

//    chrome.cookies.getAll({
//          'domain': '.bungie.net'
//        }, function(cookies) {
//          if (_.size(cookies) > 0) {
//            for (var i=0; i<cookies.length; i++){
//                if (cookies[i].name=='bungled') {
//                    RestangularProvider.setDefaultHeaders(
//                        {'X-API-Key': 'a119bbcfd2974bf6971ca1761aeb34a5',
//                         'X-Csrf':cookies[i].value});
//                }
//            }
//
//          } else {
//            RestangularProvider.setDefaultHeaders(
//                {'X-API-Key': 'a119bbcfd2974bf6971ca1761aeb34a5'});
//          }
//    });
    
    var dashboardTemplate ='<div class="row"><div class="col-lg-12"><div class="page-header"><h3>Greetings, Hive Bane!</h3></div></div></div>';
    
    dashboardTemplate +='<div class="row dashboard-content"><div class="col-lg-6"><div class="panel panel-default" ng-repeat="collection in dashboardController.collections | orderElement" ng-if="$even">'
    
    dashboardTemplate +='<ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]" datastore="dashboardController.datastore"></ma-dashboard-panel></div></div>';
    
    dashboardTemplate +='<div class="col-lg-6"><div class="panel panel-default" ng-repeat="collection in dashboardController.collections | orderElement" ng-if="$odd"><ma-dashboard-panel collection="collection" entries="dashboardController.entries[collection.name()]" datastore="dashboardController.datastore"></ma-dashboard-panel></div></div></div>';
    
    var myaccount = admin.getEntity('myaccount');
    var myaccountfields = myaccount._views.ListView._fields;
    
    console.log(myaccount._views.ListView._fields);
    
        var dash = nga.dashboard().addCollection(nga.collection(myaccount)
            .fields(myaccountfields)).template(dashboardTemplate);
    
    return dash; //nga.dashboard().template(dashboardTemplate);
}
