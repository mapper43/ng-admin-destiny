var moment = require('moment');
var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {

    var dashboardTemplate = '<div class="row"><div class="col-lg-12"><div class="page-header"><h3>Welcome to ng-admin-destiny!</h3></div></div></div>';
    dashboardTemplate += '<i>Quick Links:</i>';
    dashboardTemplate += '<br><div class="col-md-4"><br>';
    dashboardTemplate += '<p><a class="btn btn-info" style="width:100%" href="#/guardians/list">Guardian Search</a></p>';
    dashboardTemplate += '<p><a class="btn btn-info" style="width:100%" href="#/xur/show/">Xur</a></p>';
    dashboardTemplate += '<p><a class="btn btn-info" style="width:100%" href="#/items/list?search=%7B%22categories%22:%221%22%7D">Weapons</a></p>';
    dashboardTemplate += '</div>';
    
    return nga.dashboard().template(dashboardTemplate);
}
