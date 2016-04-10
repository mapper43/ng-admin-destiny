var moment = require('moment');
import dashTemplate from './dashboardTemplate.html';
var fromNow = v => moment(v).fromNow();



export default function (nga, admin) {
    
    return nga.dashboard().template(dashTemplate);
}
