export default function (nga, admin) {
    
    var myAccountMenu= nga.menu(admin.getEntity('myaccount'))
                        .title('My Account')
                        .icon('<span class="fa fa-user fa-fw"></span>');
    
    
    return nga.menu()
        .addChild(nga.menu().title('Current Activities')
            .addChild(nga.menu().title('Nightfall').link("/nightfall/show/"))
            .addChild(nga.menu().title('Heroic Strike').link("/heroicstrike/show/"))
            .addChild(nga.menu().title('Arena').link("/arena/list"))
            .addChild(nga.menu().title('Daily Chapter').link("/dailychapter/show/"))
            .addChild(nga.menu().title('Daily Crucible').link("/dailycrucible/show/"))
            .addChild(nga.menu().title('Arms Day').link("/armsday/show/"))
            .addChild(nga.menu().title('Weekly Crucible').link("/weeklycrucible/show/"))
            .addChild(nga.menu().title('Available Bounties').link("/availablebounties/show/")))
        .addChild(nga.menu(admin.getEntity('guardians'))
            .title('Guardian Search')
            .icon('<span class="fa fa-users fa-fw"></span>'))
        .addChild(myAccountMenu)
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
    
    ;
}
