/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
app
  .constant('APP_CLIENTS', {
    'clientImages': [{'image': 'assets/img/clients/1.png', 'link': 'http://www.rosiemccanns.com'},
    				  {'image': 'assets/img/clients/4.png', 'link': 'http://www.montecarloniteclub.com'},
    				  {'image': 'assets/img/clients/5.png', 'link': 'https://www.facebook.com/myth.taverna/'},
    				  {'image': 'assets/img/clients/6.png', 'link': 'http://www.thecardifflounge.com/'},
    				  {'image': 'assets/img/clients/mist.png', 'link': 'https://www.mist.com//'},
                      {'image': 'assets/img/clients/tsys.png', 'link': 'http://tsys.com/'},
    				  {'image': 'assets/img/clients/10.png', 'link': 'http://www.casinom8trix.com/'},
    				  {'image': 'assets/img/clients/11.png', 'link': 'http://www.opalnightclub.com'},
    				  {'image': 'assets/img/clients/12.png', 'link': 'http://www.aurasj.com'},
    				  {'image': 'assets/img/clients/15.png', 'link': 'https://www.facebook.com/thevenuelivermore/'},
    				  {'image': 'assets/img/clients/17.png', 'link': 'http://charleyslg.com/'},
    				  {'image': 'assets/img/clients/18.png', 'link': 'http://blowfishsushi.com/'},
    				  {'image': 'assets/img/clients/19.png', 'link': 'http://loftbarandbistro.com'},
    				  {'image': 'assets/img/clients/20.png', 'link': 'http://www.lvl44.com'},
    				  {'image': 'assets/img/clients/21.png', 'link': 'http://alibiloungelv.com/'},
    				  {'image': 'assets/img/clients/22.png', 'link': 'http://omnianightclub.com/'},
    				  {'image': 'assets/img/clients/23.png', 'link': 'http://liquidpoollv.com/'},
    				  {'image': 'assets/img/clients/25.jpg', 'link': 'https://thebanklasvegas.com/home'},
    				  {'image': 'assets/img/clients/26.png', 'link': 'http://wetrepublic.com/'},
    				  {'image': 'assets/img/clients/27.png', 'link': 'https://1oaklasvegas.com/home/'},
    				  {'image': 'assets/img/clients/28.png', 'link': 'https://barepoollv.com'},
    				  {'image': 'assets/img/clients/29.png', 'link': 'https://www.aria.com/en/nightlife.html'},
    				  {'image': 'assets/img/clients/31.png', 'link': 'https://www.crawllv.com'},
    				  {'image': 'assets/img/clients/32.png', 'link': 'http://www.nightlifeunlocked.com'},
    				  {'image': 'assets/img/clients/noir-lounge.png', 'link': 'http://www.noir-sf.com/'},
    				  {'image': 'assets/img/clients/wine-jar.png', 'link': 'http://winejar-sf.com/'}]
  })
  .constant('APP_ARRAYS', {
    'country': [{"countryName": "North America", "shortName": "USA"},
                {"countryName": "Canada", "shortName": "CANADA"},
                {"countryName": "South America", "shortName": "SAM"},
                {"countryName": "India", "shortName": "IND"}],
    'serviceTabs': [{'title': 'CLUBS', 'icon': 'assets/img/ic_club.png'},
                    {'title': 'CASINOS', 'icon': 'assets/img/ic_casino.png'},
                    {'title': 'BARS', 'icon': 'assets/img/ic_bar.png'},
                    {'title': 'KARAOKE', 'icon': 'assets/img/ic_karaoke.png'},
                    {'title': 'BOWLING', 'icon': 'assets/img/ic_bowling.png'},
                    {'title': 'RESTAURANTS', 'icon': 'assets/img/ic_restaurant.png'}],
    'features': [{'title': 'FEATURE_REAL_TIME_RES', 'description':'FEATURE_REAL_TIME_DESC', 'image': 'assets/img/ic_reservations.png', 'color': 'color-info'},
                 {'title': 'FEATURE_FOOD_DRINK', 'description':'FEATURE_FOOD_DRINK_DESC', 'image': 'assets/img/ic_fooddrink.png', 'color': 'color-warning'},
                 {'title': 'FEATURE_GUEST_LIST', 'description':'FEATURE_GUEST_LIST_DESC', 'image': 'assets/img/ic_guestlist.png', 'color': 'color-success'},
                 {'title': 'FEATURE_ORDER_PAY', 'description':'FEATURE_ORDER_PAY_DESC', 'image': 'assets/img/ic_payments.png', 'color': 'color-danger'},
                 {'title': 'FEATURE_BUSINESS', 'description':'FEATURE_BUSINESS_DESC', 'image': 'assets/img/ic_analytics.png', 'color': 'color-info'},
                 {'title': 'FEATURE_WIFI', 'description':'FEATURE_WIFI_DESC', 'image': 'assets/img/ic_wifi.png', 'color': 'color-warning'},
                 {'title': 'FEATURE_PRIVATE_EVENT', 'description':'FEATURE_PRIVATE_EVENT_DESC', 'image': 'assets/img/ic_privatevent.png', 'color': 'color-success'},
                 {'title': 'FEATURE_LOYALTY', 'description':'FEATURE_LOYALTY_DESC', 'image': 'assets/img/ic_campaign.png', 'color': 'color-danger'}],
    'serviceSmallIcons': [{"title":"Karaoke", "tab":"k", "image":"assets/img/ic_karaoke.png", "fieldName":"Advance.KarokeRequest.enable"},
                         {"title":"BottleService", "tab":"b", "image":"assets/img/ic_bottle.png", "fieldName":"Advance.BottleService.enable"},
                         {"title":"Deals", "tab":"o", "image":"assets/img/ic_deals.png", "fieldName":"Advance.deals.enable"},
                         {"title":"Food", "tab":"f", "image":"assets/img/food.png", "fieldName":"Advance.FoodRequest.enable"},
                         {"title":"GuestList", "tab":"g", "image":"assets/img/guest.png", "fieldName":"Advance.GuestList.enable"},
                         {"title":"Private Event", "tab":"p", "image":"assets/img/private.png", "fieldName":"Advance.BookBanqetHall.enable"}],
    'cityName': [{"city":"LOS ANGELES"}, {"city":"NEW JERSEY"}, {"city":"FLORIDA"}, {"city":"CALIFORNIA"}],
    'categories': [{"category":"WEDDING"}, {"category":"BIRTHDAY PARTY"}, {"category":"EVENT"}, {"category":"BARS"},
                   {"category":"CLUBS"}, {"category":"LOUNGE"}, {"category":"CASINO"}, {"category":"RESTAURANT"},
                   {"category":"HOTEL"}, {"category":"KARAOKE"}, {"category":"BOWLING"}],
    'roles': [{"role":"General Manager"}, {"role":"Owner"}]

  });