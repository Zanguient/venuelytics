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
    				  {'image': 'assets/img/clients/7.png', 'link': 'http://www.thebranhamsj.com/'},
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
    'country': ['North America', 'Canada', 'South America', 'India'],
    'serviceTabs': ['CLUB', 'CASINO', 'BAR', 'KARAOKE', 'BOWLING', 'RESTAURANT'],
    'serviceTabs1': [{'title': 'CLUB', 'icon': 'fa fa-diamond'},
                    {'title': 'CASINO', 'icon': 'fa fa-diamond'},
                    {'title': 'BAR', 'icon': 'fa fa-glass'},
                    {'title': 'KARAOKE', 'icon': 'fa fa-music'},
                    {'title': 'BOWLING', 'icon': 'fa fa-futbol-o'},
                    {'title': 'RESTAURANT', 'icon': ''}],
    'features': [{'title': 'Real-Time Reservations', 'description':'In-Venue & Pre-Booking of Table, Bottle Services over Mobile Web, App, Notifications, SMS & Email', 'icon': 'zmdi zmdi-cloud-outline', 'color': 'color-info'},
                 {'title': 'Food & Drink Services', 'description':'Ordering Food & Drinks for Delivery & Pickup at the Venue', 'icon': 'zmdi zmdi-desktop-mac', 'color': 'color-warning'},
                 {'title': 'Guest List', 'description':'Easy Access To New & Existing Customers. Grow the customer base with Guest Registration & WIFI', 'icon': 'zmdi zmdi-download', 'color': 'color-success'},
                 {'title': 'Order & Pay', 'description':'Request for Premium Services with instant Mobile Pay', 'icon': 'zmdi zmdi-flower-alt', 'color': 'color-danger'},
                 {'title': 'Business Analytics', 'description':'Customer Insights, Predictive Analytics & Patent Pending Machine Learning Technology', 'icon': 'zmdi zmdi-cloud-outline', 'color': 'color-info'},
                 {'title': 'WIFI & White Label Solution', 'description':'Access to the reservations, ordering & payment via white label app & WIFI Hotspot', 'icon': 'zmdi zmdi-desktop-mac', 'color': 'color-warning'},
                 {'title': 'Private Events', 'description':'Book Banquet Halls, Karaoke Rooms & Event Tickets', 'icon': 'zmdi zmdi-download', 'color': 'color-success'},
                 {'title': 'Campaign & Loyalty Management', 'description':'Personalized Deals, Offers, Digital Rewards, Events and Booking.', 'icon': 'zmdi zmdi-flower-alt', 'color': 'color-danger'}],
    'serviceSmallIcons': [{"title":"Karaoke", "tab":"k", "image":"assets/img/karaoke.png", "fieldName":"Advance.KarokeRequest.enable"},
                         {"title":"BottleService", "tab":"b", "image":"assets/img/karaoke.png", "fieldName":"Advance.BottleService.enable"},
                         {"title":"Deals", "tab":"o", "image":"assets/img/food.png", "fieldName":"Advance.deals.enable"},
                         {"title":"Food", "tab":"f", "image":"assets/img/food.png", "fieldName":"Advance.FoodRequest.enable"},
                         {"title":"GuestList", "tab":"g", "image":"assets/img/guest.png", "fieldName":"Advance.GuestList.enable"},
                         {"title":"Private Event", "tab":"p", "image":"assets/img/private.png", "fieldName":"Advance.BookBanqetHall.enable"}]

  });