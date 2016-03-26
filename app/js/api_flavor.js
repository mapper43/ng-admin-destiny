function requestInterceptor(RestangularProvider) {
    // use the custom query parameters function to format the API request correctly
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
    if (operation == "getList") {

        params.definitions = true;

        // custom pagination params
        if (params._page) {
            params.page=params._page;
            params.count = params._perPage;
            params._start = (params._page - 1) * params._perPage;
            params._end = params._page * params._perPage;
        }
        delete params._page;
        delete params._perPage;
        // custom sort params
        if (params._sortField) {
            params._sort = params._sortField;
            params._order = params._sortDir;
            delete params._sortField;
            delete params._sortDir;
        }
        // custom filters
        if (params._filters) {
            for (var filter in params._filters) {
                params[filter] = params._filters[filter];
            }
            delete params._filters;
        }


    }
    return { params: params };
});
    
//    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
//        if (operation == "getList") {
//            // custom pagination params
//            if (params._page) {
//                params.page=params._page;
//                params.count = params._perPage;
//                var start = (params._page - 1) * params._perPage;
//                var end = params._page * params._perPage - 1;
//                params.range = "[" + start + "," + end + "]";
//                delete params._page;
//                delete params._perPage;
//            }
//            // custom sort params
//            if (params._sortField) {
//                params.sort = '["' + params._sortField + '","' + params._sortDir + '"]';
//                delete params._sortField;
//                delete params._sortDir;
//            }
//            // custom filters
//            if (params._filters) {
//                params.filter = params._filters;
//                delete params._filters;
//            }
////            if (headers['Content-Range']) {
////                headers['X-Total-Count'] = headers['Content-Range'].split('/').pop();
////            }
//            //bungie cookie
//            headers['X-API-Key'] = 'a119bbcfd2974bf6971ca1761aeb34a5';
//
//        }
//        return { params: params, headers: headers };
//    });
}

function responseInterceptor(RestangularProvider) {
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
//        if (operation == "getList") {
//            //var contentRange = response.headers('Content-Range');
//            //response.totalCount = contentRange.split('/')[1];
//            var arr = Object.keys(data.Response.definitions.items).map(function (key) {return data.Response.definitions.items[key]});
//            data = arr;
//            return data;
//        }
        if (operation == "getList") {
            var arr = Object.keys(data.Response.definitions.items).map(function (key) {return data.Response.definitions.items[key]});
            data = arr;
        }
        return data;
        
    });
}

export default { requestInterceptor, responseInterceptor }