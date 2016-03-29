function requestInterceptor(RestangularProvider) {
    // use the custom query parameters function to format the API request correctly
    
    RestangularProvider.setDefaultHeaders({'X-API-Key': 'YOUR_API_KEY'});
    
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        
        params.definitions='true';
        
        if (operation == "getList") {
            if (what=='items'){
                if (params._sortDir=='DESC')
                    params.direction='descending';
                else 
                    params.direction='ascending';
                    
                
                if (params._sortField=='itemName')
                    params.order=1;
                else if (params._sortField=='itemTypeName')
                    params.order=4;
                else if (params._sortField=='tierTypeName')
                    params.order=3;
                else
                    params.order=1;
                
            }
            
            if (params._filters) {
                params.filter = params._filters;
                delete params._filters;
            }
            
            // custom pagination params
            if (params._page) {
                var start = (params._page - 1) * params._perPage;
                var end = params._page * params._perPage - 1;
                params.range = "[" + start + "," + end + "]";
                delete params._page;
                delete params._perPage;
            }
            // custom sort params
            if (params._sortField) {
                params.sort = '["' + params._sortField + '","' + params._sortDir + '"]';
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            
            if (headers['Content-Range']) {
                headers['X-Total-Count'] = headers['Content-Range'].split('/').pop();
            }
            delete params.range;
            delete params.sort;
            
            
        }
        return { params: params, headers: headers };
    });
}

function responseInterceptor(RestangularProvider,currentPlatformId,currentMemberId,currentCharacterId) {
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response,params) {
//        if (operation == "getList") {
//            var contentRange = response.headers('Content-Range');
//            response.totalCount = contentRange.split('/')[1];
//        }
        
        
        if (operation == "getList" && what == "guardians") {
            if (data){
                data.Response.displayName = params.displayname;
                data = data.Response;
            } else {
                data = [];
            }
        }
        
        if (operation == "getList" && what == "characters") {
            var arr = Object.keys(data.Response.data.characters).map(function (key) {return data.Response.data.characters[key]});
            var classesArray = data.Response.definitions.classes;
            for (var i=0; i< arr.length; i++){
                arr[i].characterBase.classDef = classesArray[arr[i].characterBase.classHash];
            }
            data = arr;
        }
        if (operation == "get" && what == "inventory") {
            var item = data.Response.data.item;
            item.definition = data.Response.definitions.items[item.itemHash];
            for (var i=0; i< item.perks.length; i++){
                item.perks[i].definition = data.Response.definitions.perks[item.perks[i].perkHash];
            }
            data = item;
        }
        if (operation == "getList" && what == "inventory") {
            if (data) {
                var urlArr = response.config.url.toLowerCase().split('/');
                var platId,memId,charId;
                var accountIndex = urlArr.indexOf('account');
                platId = urlArr[accountIndex-1];
                memId = urlArr[accountIndex+1];
                charId = urlArr[accountIndex+3];
                
                var equippables = data.Response.data.buckets.Equippable;
                var arr = [];
                
                for (var i=0; i<equippables.length; i++){
                    var item = equippables[i].items[0];
                    if (item && item.itemHash) {
                        item.definition = data.Response.definitions.items[item.itemHash];
                        
                        item.currentCharacterId=charId;
                        item.currentPlatformId=platId;
                        item.currentMemberId=memId;
                        
                        arr.push(item);
                    }
                }
                data=arr;
               
            } else {
                data = [];
            }
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
        if (operation == "getList" && what == "items") {
            //added to handle multipage response from bungie api
            var totalResults = data.Response.data.totalResults;
            response.totalCount=totalResults;
            
            var arr = data.Response.data.itemHashes;
            for (var i=0; i<arr.length; i++){
                data.Response.data.itemHashes[i]=data.Response.definitions.items[arr[i]];
            }
            data = arr;  
        }
        
        if (operation == "get" && what=="items") {
            if (data && data.Response && data.Response.data && data.Response.data.inventoryItem){
                data = data.Response.data.inventoryItem;
            } else {
                data = [];
            }
        }
        if (operation == "get" && what=="nightfall") {
            if (data && data.Response && data.Response.data && data.Response.data.nightfall){
                var actId = data.Response.data.nightfall.activityBundleHash; data.Response.data.nightfall.definition=data.Response.definitions.activities[actId]
                
                
                var rewardDefs = data.Response.data.nightfall.definition.rewards;

                for (var i=0; i<rewardDefs.length; i++){
                    data.Response.data.nightfall.definition.rewards[i].definition = data.Response.definitions.items[rewardDefs[i].rewardItems[0].itemHash];
                    data.Response.data.nightfall.definition.rewards[i].definition.value = rewardDefs[i].rewardItems[0].value;
                }
                    
                    
                data = data.Response.data.nightfall;
            } else {
                data = [];
            }
        }
        if (operation == "get" && what=="heroicstrike") {
            if (data && data.Response && data.Response.data && data.Response.data.heroicStrike){
               var actId = data.Response.data.heroicStrike.activityBundleHash; data.Response.data.heroicStrike.definition=data.Response.definitions.activities[actId]
                
                var rewardDefs = data.Response.data.heroicStrike.definition.rewards;

                for (var i=0; i<rewardDefs.length; i++){
                    data.Response.data.heroicStrike.definition.rewards[i].definition = data.Response.definitions.items[rewardDefs[i].rewardItems[0].itemHash];
                    data.Response.data.heroicStrike.definition.rewards[i].definition.value = rewardDefs[i].rewardItems[0].value;
                }
                data = data.Response.data.heroicStrike;
                
            } else {
                data = [];
            }
        }
        if (operation == "get" && what=="dailychapter") {
            if (data && data.Response && data.Response.data && data.Response.data.dailyChapter){
               var actId = data.Response.data.dailyChapter.activityBundleHash; data.Response.data.dailyChapter.definition=data.Response.definitions.activities[actId]
                
                var rewardDefs = data.Response.data.dailyChapter.definition.rewards;

                for (var i=0; i<rewardDefs.length; i++){
                    data.Response.data.dailyChapter.definition.rewards[i].definition = data.Response.definitions.items[rewardDefs[i].rewardItems[0].itemHash];
                    data.Response.data.dailyChapter.definition.rewards[i].definition.value = rewardDefs[i].rewardItems[0].value;
                }
                data = data.Response.data.dailyChapter;
                
            } else {
                data = [];
            }
        }
        if (operation == "get" && what=="dailycrucible") {
            if (data && data.Response && data.Response.data && data.Response.data.dailyCrucible){
               var actId = data.Response.data.dailyCrucible.activityBundleHash; data.Response.data.dailyCrucible.definition=data.Response.definitions.activities[actId]
                
                var rewardDefs = data.Response.data.dailyCrucible.definition.rewards;

                for (var i=0; i<rewardDefs.length; i++){
                    data.Response.data.dailyCrucible.definition.rewards[i].definition = data.Response.definitions.items[rewardDefs[i].rewardItems[0].itemHash];
                    data.Response.data.dailyCrucible.definition.rewards[i].definition.value = rewardDefs[i].rewardItems[0].value;
                }
                data = data.Response.data.dailyCrucible;
                
            } else {
                data = [];
            }
        }
        if (operation == "get" && what=="weeklycrucible") {
            if (data && data.Response && data.Response.data && data.Response.data.weeklyCrucible){
                
                var actId = data.Response.data.weeklyCrucible[0].activityBundleHash; 
                console.log(actId);
                
                data.Response.data.weeklyCrucible[0].definition= data.Response.definitions.activityBundles[actId];
                
                data = data.Response.data.weeklyCrucible[0];
                
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what=="arena") {
            var arr = Object.keys(data.Response.data.arena).map(function (key) {return data.Response.data.arena[key]});
            
            for (var i=0; i<arr.length; i++){
                arr[i].definition = data.Response.definitions.activities[arr[i].activityHash];
            }
            data=arr;   
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
        if (operation == "get" && what=="availablebounties") {
            var arr = Object.keys(data.Response.data.availableBounties).map(function (key) {return data.Response.data.availableBounties[key]});
            var saleItems = arr[0].saleItems;
            
            for (var i=0; i<arr[0].saleItems.length; i++){
                arr[0].saleItems[i].item.definition = data.Response.definitions.items[arr[0].saleItems[i].item.itemHash];
            }
            
            data=arr[0];
        }
        
        return data;
        
    });
}
export default { requestInterceptor, responseInterceptor }
