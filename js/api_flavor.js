function requestInterceptor(RestangularProvider) {
    // use the custom query parameters function to format the API request correctly
    
    RestangularProvider.setDefaultHeaders({'X-API-Key': 'YOUR_API_KEY'});
          

    chrome.cookies.getAll({
          'domain': '.bungie.net'
        }, function(cookies) {
          if (_.size(cookies) > 0) {
            for (var i=0; i<cookies.length; i++){
                if (cookies[i].name=='bungled') {
                    RestangularProvider.setDefaultHeaders(
                        {'X-API-Key': 'YOUR_API_KEY',
                         'X-Csrf':cookies[i].value});
                }
            }

          }
    });
    
    
    
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params,httpConfig) {  
        
        params.definitions='true';
         
        if (operation == "getList") {
            if (what=='items' || what=='vault' || what=='inventory'){
                
                
                if (params._sortDir=='DESC')
                    params.direction='descending';
                else 
                    params.direction='ascending';
                    
                console.log(params._sortField);
                
                if (params._sortField=='itemName'||params._sortField=='definition.itemName')
                    params.order=1;
                else if (params._sortField=='itemTypeName'||params._sortField=='definition.itemTypeName')
                    params.order=4;
                else if (params._sortField=='tierTypeName'||params._sortField=='definition.tierTypeName')
                    params.order=3;
                else if (params._sortField=='primaryStat.value')
                    params.order='primaryStat';    
                else
                    params.order='primaryStat';
                
            }
            
            if (params._filters) {
                if (what=='vault'){
                    params.characterid=params._filters.characterid;
                    params.memberid=params._filters.memberid;
                    params.platformid=params._filters.platformid;
                }
                params.filter = params._filters;
                delete params._filters;
            }
            
            // custom pagination params
            if (params._page) {
                
                params.page=params._page-1;
                params.count = params._perPage;
                
                //var start = (params._page - 1) * params._perPage;
                //var end = params._page * params._perPage - 1;
                //params.range = "[" + start + "," + end + "]";
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
        if (operation == "get" && what == "characters") {
            if (data){
                for (var i=0; i<data.Response.data.characters.length; i++){
                    data.Response.data.characters[i].race = data.Response.definitions.races[data.Response.data.characters[i].characterBase.raceHash];
                    data.Response.data.characters[i].gender = data.Response.definitions.genders[data.Response.data.characters[i].characterBase.genderHash];
                    data.Response.data.characters[i].class = data.Response.definitions.classes[data.Response.data.characters[i].characterBase.classHash];
                }
                data=data.Response.data;
            } else {
                data = null;
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
        if (operation == "get" && what == "charactersummary") {
            if (data){
                data.Response.data.uniqueId = data.Response.data.characterBase.membershipType + '-' + data.Response.data.characterBase.membershipId + '-'  + data.Response.data.characterBase.characterId;
                data.Response.data.characterBase.class=data.Response.definitions.classes[data.Response.data.characterBase.classHash];
                data.Response.data.characterBase.race=data.Response.definitions.races[data.Response.data.characterBase.raceHash];
                data.Response.data.characterBase.gender=data.Response.definitions.genders[data.Response.data.characterBase.genderHash];
                
                for (var key in data.Response.data.characterBase.stats) {
                    var obj = data.Response.data.characterBase.stats[key];
                    data.Response.data.characterBase.stats[key].definition = data.Response.definitions.stats[obj.statHash];
                }
                for (var i=0; i<data.Response.data.characterBase.peerView.equipment.length; i++) {
                    var obj = data.Response.data.characterBase.peerView.equipment[i];
                    data.Response.data.characterBase.peerView.equipment[i].definition = data.Response.definitions.items[obj.itemHash];
                    
                    if (data.Response.data.characterBase.peerView.equipment[i].definition.stats[data.Response.data.characterBase.peerView.equipment[i].definition.primaryBaseStatHash]){
                        data.Response.data.characterBase.peerView.equipment[i].primaryStat = data.Response.data.characterBase.peerView.equipment[i].definition.stats[data.Response.data.characterBase.peerView.equipment[i].definition.primaryBaseStatHash].value
                    } else {
                        data.Response.data.characterBase.peerView.equipment[i].primaryStat =0;
                    }
                }
                data = data.Response.data;
                
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what == "vendors") {
            var urlArr = response.config.url.toLowerCase().split('/');
            var platId,charId;
            var accountIndex = urlArr.indexOf('myaccount');
            platId = urlArr[accountIndex-1];
            charId = urlArr[accountIndex+2];
            
            var arr = Object.keys(data.Response.data.vendors).map(function (key) {return data.Response.data.vendors[key]});
            for (var i=0; i< arr.length; i++){
                arr[i].membershipType = platId;
                arr[i].characterId = charId;
                arr[i].definition = data.Response.definitions.vendorDetails[arr[i].vendorHash];
            }
            data = arr;
        }
        if (operation == "getList" && what == "vendoritems") {
            var arr = data.Response.data.saleItemCategories;
            for (var i=0; i<arr.length; i++){
                var items = arr[i].saleItems;
                for ( var j=0; j<items.length;j++){
                    var item =data.Response.data.saleItemCategories[i].saleItems[j];
                    var perks = data.Response.data.saleItemCategories[i].saleItems[j].item.perks;
                    
                    data.Response.data.saleItemCategories[i].saleItems[j].definition = data.Response.definitions.items[item.item.itemHash];
                    
                    for (var k=0; k<perks.length; k++){
                       var perk = data.Response.data.saleItemCategories[i].saleItems[j].item.perks[k]; data.Response.data.saleItemCategories[i].saleItems[j].item.perks[k].definition = data.Response.definitions.perks[perk.perkHash];
                    }
                }
            }
            data = data.Response.data.saleItemCategories;  
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
                        item.unique_id=platId + '-'+memId+'-'+charId;
                        arr.push(item);
                    }
                }
                //bungie api doesn't allow sorting by these fields
                var arr2 = arr.sort(function(a, b) {
                    var orderDir=1;
                    if (response.config.params.direction=='descending')
                        orderDir=-1;
                    var orderField=response.config.params.order;
                    if (orderField==1){
                        return orderDir*((a.definition.itemName > b.definition.itemName) - (a.definition.itemName < b.definition.itemName));
                    } else if (orderField==4){
                        return orderDir*((a.definition.itemTypeName > b.definition.itemTypeName) - (a.definition.itemTypeName < b.definition.itemTypeName));
                    } else if (orderField==3){
                        return orderDir*((a.definition.tierTypeName > b.definition.tierTypeName) - (a.definition.tierTypeName < b.definition.tierTypeName));
                    } else if (orderField=='primaryStat'){
                        var statA,statB;
                        if (a.primaryStat && a.primaryStat.value){
                            statA = a.primaryStat.value;
                        }else{
                            statA = "0";
                        }
                        if (b.primaryStat && b.primaryStat.value){
                            statB = b.primaryStat.value;
                        }else{
                            statB = "0";
                        }
                        return orderDir*((statA > statB) - (statA < statB));
                    }
                    
                });
                data=arr;
                
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what == "activities") {
            if (data){
                var activities = data.Response.data.available;
                var definitions = data.Response.definitions.activities;
                for (var i=0; i<activities.length; i++){
                    data.Response.data.available[i].definition = definitions[activities[i].activityHash];
                }
                data=data.Response.data.available;
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what == "carnagereport") {
            if (data){
                
                
                for (var i=0; i<data.Response.data.entries.length; i++){
                    data.Response.data.entries[i].entryid = i;
                }
                data=data.Response.data.entries;
                
            } else {
                data = [];
            }
        }
        if (operation == "getList" && what == "stats") {
            
            if (data){
                var arr = [];
                
                for(var i in data.Response){
                  var statObj = {};
                  statObj.statsval = data.Response[i];
                  statObj.keyval = i; 
                  arr.push(statObj);
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
                //console.log(actId);
                
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
        if (operation == "getList" && what=="myaccount") {
            if (data && data.Response && data.Response.destinyAccounts){
                for (var i=0; i<data.Response.destinyAccounts.length; i++){
                    var platId = data.Response.destinyAccounts[i].userInfo.membershipType;
                    var memId = data.Response.destinyAccounts[i].userInfo.membershipId;
                    
                    for (var j=0; j<data.Response.destinyAccounts[i].characters.length;j++){
                        data.Response.destinyAccounts[i].characters[j].membershipType=platId;
                        data.Response.destinyAccounts[i].characters[j].membershipId=memId;
                        
                    }
                }
                
                data=data.Response.destinyAccounts;
            } else {
                data = [{message:'http://www.bungie.net'}];
            }
        }
        if (operation == "get" && what=="myaccount") {
            if (data && data.Response && data.Response.destinyAccounts){
                data.Response.defaultSortField='vault_ListView.primaryStat.value';
                data=data.Response;
            } else {
                data = [{message:'http://www.bungie.net'}];
            }
        }
        if (operation == "get" && what == "vaultitem"){
            data.Response.data.inventoryItem.talentGrid = data.Response.definitions.talentGrids[data.Response.data.inventoryItem.talentGridHash];
            
            var perkHashes = data.Response.data.inventoryItem.perkHashes;
            data.Response.data.inventoryItem.perks=[];
            
            for (var i=0; i<perkHashes.length; i++){
                data.Response.data.inventoryItem.perks.push(data.Response.definitions.perks[perkHashes[i]]);
            }
            var nodes = [];
            if (data.Response.data.inventoryItem.talentGrid && data.Response.data.inventoryItem.talentGrid.nodes)
                nodes=data.Response.data.inventoryItem.talentGrid.nodes;
            
            for (var i=0; i<nodes.length; i++){
                var steps = data.Response.data.inventoryItem.talentGrid.nodes[i].steps;
                for (var j=0; j<steps.length; j++){
                    var perkHashes = steps[j].perkHashes;
                    data.Response.data.inventoryItem.talentGrid.nodes[i].steps[j].perks=[];
                    for (var k=0; k<perkHashes.length; k++){
                        data.Response.data.inventoryItem.talentGrid.nodes[i].steps[j].perks.push(data.Response.definitions.perks[perkHashes[k]]);
                        
                    }
                }
            }
            data = data.Response.data.inventoryItem;
            
            
            
            
        }
        if (operation == "getList" && what=="vault") {
            if (data && data.Response && data.Response.data){
                var platId,memId,charId;
                //console.log(url);
                charId = response.config.params.characterid;
                platId = response.config.params.platformid;
                memId = response.config.params.memberid;
                
                for (var i=0; i<data.Response.data.items.length; i++){
                    
                    data.Response.data.items[i].currentCharacterId=charId;
                    data.Response.data.items[i].currentPlatformId=platId;
                    data.Response.data.items[i].currentMemberId=memId;
                    
                    data.Response.data.items[i].uniqueId=data.Response.data.items[i].itemHash+'-'+data.Response.data.items[i].itemId;
                    data.Response.data.items[i].definition=data.Response.definitions.items[data.Response.data.items[i].itemHash];
                    
                    data.Response.data.items[i].talentGrid = data.Response.definitions.talentGrids[data.Response.data.items[i].definition.talentGridHash];
                
                }
                //bungie api doesn't allow sorting by these fields
                var arr = data.Response.data.items.sort(function(a, b) {
                    console.log(response.config.params.order);
                    
                    var orderDir=1;
                    if (response.config.params.direction=='descending')
                        orderDir=-1;
                    var orderField=response.config.params.order;
                    if (orderField==1){
                        return orderDir*((a.definition.itemName > b.definition.itemName) - (a.definition.itemName < b.definition.itemName));
                    } else if (orderField==4){
                        return orderDir*((a.definition.itemTypeName > b.definition.itemTypeName) - (a.definition.itemTypeName < b.definition.itemTypeName));
                    } else if (orderField==3){
                        return orderDir*((a.definition.tierTypeName > b.definition.tierTypeName) - (a.definition.tierTypeName < b.definition.tierTypeName));
                    } else if (orderField=='primaryStat'){
                        var statA,statB;
                        if (a.primaryStat && a.primaryStat.value){
                            statA = a.primaryStat.value;
                        }else{
                            statA = "0";
                        }
                        if (b.primaryStat && b.primaryStat.value){
                            statB = b.primaryStat.value;
                        }else{
                            statB = "0";
                        }
                        return orderDir*((statA > statB) - (statA < statB));
                    }
                    
                });
                                        
                data=arr;
            } else {
                data = [];
            }
        }
        
        return data;
        
    });
}
export default { requestInterceptor, responseInterceptor }
