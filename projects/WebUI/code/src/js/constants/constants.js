/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
app
  .constant('APP_CLIENTS', {
    'clientImages': [{ 'image': 'assets/img/clients/rosie.png', 'link': '//www.rosiemccanns.com' },
    { 'image': 'assets/img/clients/monte-carlo.png', 'link': '//www.montecarloniteclub.com' },
    { 'image': 'assets/img/clients/myth-1.png', 'link': '//www.facebook.com/myth.taverna/' },
    /* {'image': 'assets/img/clients/6.png', 'link': '//www.thecardifflounge.com/'},*/
    { 'image': 'assets/img/clients/mist-1.png', 'link': '//www.mist.com//' },
    { 'image': 'assets/img/clients/tsys-1.png', 'link': '//tsys.com/' },
    { 'image': 'assets/img/clients/casio-m8trix.png', 'link': '//www.casinom8trix.com/' },
    { 'image': 'assets/img/clients/opal.png', 'link': '//www.opalnightclub.com' },
    { 'image': 'assets/img/clients/aura.png', 'link': '//www.aurasj.com' },
    { 'image': 'assets/img/clients/the-venue.png', 'link': '//www.facebook.com/thevenuelivermore/' },
    { 'image': 'assets/img/clients/charleyslg.png', 'link': '//charleyslg.com/' },
    /* {'image': 'assets/img/clients/18.png', 'link': '//blowfishsushi.com/'}, */
    { 'image': 'assets/img/clients/loft.png', 'link': '//loftbarandbistro.com' },
    { 'image': 'assets/img/clients/lvl-44.png', 'link': '//www.lvl44.com' },
    { 'image': 'assets/img/clients/alibi.png', 'link': '//alibiloungelv.com/' },
    { 'image': 'assets/img/clients/omnia.png', 'link': '//omnianightclub.com/' },
    { 'image': 'assets/img/clients/liquid.png', 'link': '//liquidpoollv.com/' },
    { 'image': 'assets/img/clients/the-bank.png', 'link': '//thebanklasvegas.com/home' },
    { 'image': 'assets/img/clients/wet-republic.png', 'link': '//wetrepublic.com/' },
    { 'image': 'assets/img/clients/1-oak.png', 'link': '//1oaklasvegas.com/home/' },
    { 'image': 'assets/img/clients/bare.png', 'link': '//barepoollv.com' },
    /* {'image': 'assets/img/clients/29.png', 'link': '//www.aria.com/en/nightlife.html'}, */
    { 'image': 'assets/img/clients/crawlly.png', 'link': '//www.crawllv.com' },
    { 'image': 'assets/img/clients/nightlife.png', 'link': '//www.nightlifeunlocked.com' },
    { 'image': 'assets/img/clients/noir-lounge-1.png', 'link': '//www.noir-sf.com/' },
    { 'image': 'assets/img/clients/wine-jar-1.png', 'link': '//winejar-sf.com/' },
    { 'image': 'assets/img/clients/mayes-1.png', 'link': '//www.mayessf.com/' },
    { 'image': 'assets/img/clients/fan-1.png', 'link': '//www.spriza.com/' },
    { 'image': 'assets/img/clients/lure.png', 'link': '//www.lurehollywood.com/' },
    { 'image': 'assets/img/clients/lejardin.png', 'link': '//www.lejardin.la/' },
    { 'image': 'assets/img/clients/fuz-1.png', 'link': '//www.fuzlounge.com/' },
    { 'image': 'assets/img/clients/sjlive-1.png', 'link': '//www.sjlivesj.com/' },
    { 'image': 'assets/img/clients/eighty-1.png', 'link': '//eightyonesj.com/' },
    { 'image': 'assets/img/clients/shboom-logo.png', 'link': '//www.shboomnightclub.com/' },
    { 'image': 'assets/img/clients/bourbon.png', 'link': '//www.bourbonbarrelerie.com/vip' },
    { 'image': 'assets/img/clients/vip-room-1.png', 'link': '//bit.ly/VIPRoomBaltimoreBottleServiceReservations' },
    { 'image': 'assets/img/clients/zenreach-white-1.png', 'link': '' },


    ]
  })
  .constant('APP_ARRAYS', {
    'country': [{ "countryName": "North America", "shortName": "USA" },
    { "countryName": "Canada", "shortName": "CANADA" },
    { "countryName": "South America", "shortName": "SAM" },
    { "countryName": "India", "shortName": "IND" }],
    'serviceTabs': [{ 'title': 'CLUB', 'icon': 'assets/img/ic_club.png' },
    { 'title': 'CASINO', 'icon': 'assets/img/ic_casino.png' },
    { 'title': 'BAR', 'icon': 'assets/img/ic_bar.png' },
    { 'title': 'KARAOKE', 'icon': 'assets/img/ic_karaoke.png' },
    { 'title': 'BOWLING', 'icon': 'assets/img/ic_bowling.png' },
    { 'title': 'RESTAURANT', 'icon': 'assets/img/ic_restaurant.png' }],
    'breakThrough': {
      "Real-Time-Reservations": "break-through/real-time-reservations.html",
      "Food-Drink-Services": "break-through/food-drink-services.html",
      "Guest-List-Lost": "break-through/break-guest-list.html",
      "Business-Analytics-Dashboard": "break-through/business-analytics-dashboard.html",
      //      "WIFI-White-Label-Solution":"break-through/wifi-white-label.html",
      "Campaign-Loyalty-Management": "break-through/break-loyalty-management.html",
      "Break-Private-Events": "break-through/break-private-events.html"
    },
    'features': [{ 'ref': 'real-time-reservations', 'title': 'FEATURE_REAL_TIME_RES', 'description': 'FEATURE_REAL_TIME_DESC', 'image': 'assets/img/ic_reservations.png', 'color': 'color-info', 'link': 'Real-Time-Reservations' },
    { 'ref': 'food-drink-services', 'title': 'FEATURE_FOOD_DRINK', 'description': 'FEATURE_FOOD_DRINK_DESC', 'image': 'assets/img/ic_fooddrink.png', 'color': 'color-warning', 'link': 'Food-Drink-Services' },
    { 'ref': 'guest-list-services', 'title': 'FEATURE_GUEST_LIST', 'description': 'FEATURE_GUEST_LIST_DESC', 'image': 'assets/img/ic_guestlist.png', 'color': 'color-success', 'link': 'Guest-List-Lost' },
    // {'ref':'','title': 'FEATURE_ORDER_PAY', 'description':'FEATURE_ORDER_PAY_DESC', 'image': 'assets/img/ic_payments.png', 'color': 'color-danger'},
    //{'ref':'','title': 'FEATURE_BUSINESS', 'description':'FEATURE_BUSINESS_DESC', 'image': 'assets/img/ic_analytics.png', 'color': 'color-info','link':'Business-Analytics-Dashboard'},
    { 'ref': 'wifi-services', 'title': 'FEATURE_WIFI', 'description': 'FEATURE_WIFI_DESC', 'image': 'assets/img/ic_wifi.png', 'color': 'color-warning' }, //'link':'WIFI-White-Label-Solution'
    { 'ref': 'private-events', 'title': 'FEATURE_PRIVATE_EVENT', 'description': 'FEATURE_PRIVATE_EVENT_DESC', 'image': 'assets/img/ic_privatevent.png', 'color': 'color-success', 'link': 'Break-Private-Events' },
    { 'ref': 'loyalty-management', 'title': 'FEATURE_LOYALTY', 'description': 'FEATURE_LOYALTY_DESC', 'image': 'assets/img/ic_campaign.png', 'color': 'color-danger', 'link': 'Campaign-Loyalty-Management' }],
    'serviceSmallIcons': [/* {"title":"Karaoke", "tab":"k", "image":"assets/img/ic_karaoke.png", "fieldName":"Advance.KarokeRequest.enable"}, */
      { "title": "Bottle Service", "tab": "bottle-service", "image": "assets/img/ic_bottle.png", "fieldName": "Advance.BottleService.enable" },
      /* {"title":"Deals", "tab":"o", "image":"assets/img/ic_deals.png", "fieldName":"Advance.deals.enable"}, */
      { "title": "Food Services", "tab": "food-services", "image": "assets/img/food.png", "fieldName": "Advance.FoodRequest.enable" },
      { "title": "Guest List", "tab": "guest-list", "image": "assets/img/guest.png", "fieldName": "Advance.GuestList.enable" },
      { "title": "Table Services", "tab": "table-services", "image": "assets/img/table-img.png", "fieldName": "Advance.tableService.enable" },
      { "title": "Event List", "tab": "event-list", "image": "assets/img/events.png", "fieldName": "venueEvents" },
      { "title": "Drink Services", "tab": "drink-services", "image": "assets/img/drinks.png", "fieldName": "Advance.DrinksService.enable" },
      { "title": "Private Event", "tab": "private-events", "image": "assets/img/private.png", "fieldName": "Advance.BookBanqetHall.enable" }],
    // 'cityName': [{"city":"LOS ANGELES"}, {"city":"NEW JERSEY"}, {"city":"FLORIDA"}, {"city":"CALIFORNIA"}],

    'cityName': [
      { "code": "AL", "name": "Alabama" }, { "code": "AK", "name": "Alaska" },
      { "code": "AZ", "name": "Arizona" }, { "code": "AR", "name": "Arkansas" },
      { "code": "CA", "name": "California" }, { "code": "CO", "name": "Colorado" },
      { "code": "CT", "name": "Connecticut" }, { "code": "DE", "name": "Delaware" },
      { "code": "FL", "name": "Florida" }, { "code": "GA", "name": "Georgia" },
      { "code": "ID", "name": "Idaho" }, { "code": "IL", "name": "Illinois" },
      { "code": "IN", "name": "Indiana" }, { "code": "IA", "name": "Iowa" },
      { "code": "KS", "name": "Kansas" }, { "code": "KY", "name": "Kentucky" },
      { "code": "LA", "name": "Louisiana" }, { "code": "ME", "name": "Maine" },
      { "code": "MD", "name": "Maryland" }, { "code": "MA", "name": "Massachusetts" },
      { "code": "MI", "name": "Michigan" }, { "code": "MN", "name": "Minnesota" },
      { "code": "MS", "name": "Mississippi" }, { "code": "MO", "name": "Missouri" },
      { "code": "MT", "name": "Montana" }, { "code": "NE", "name": "Nebraska" },
      { "code": "NV", "name": "Nevada" }, { "code": "NH", "name": "New Hampshire" },
      { "code": "NJ", "name": "New Jersey" }, { "code": "NM", "name": "New Mexico" },
      { "code": "NY", "name": "New York" }, { "code": "NC", "name": "North Carolina" },
      { "code": "ND", "name": "North Dakota" }, { "code": "OH", "name": "Ohio" },
      { "code": "OK", "name": "Oklahoma" }, { "code": "OR", "name": "Oregon" },
      { "code": "PA", "name": "Pennsylvania" }, { "code": "RI", "name": "Rhode Island" },
      { "code": "SC", "name": "South Carolina" }, { "code": "SD", "name": "South Dakota" },
      { "code": "TN", "name": "Tennessee" }, { "code": "TX", "name": "Texas" },
      { "code": "UT", "name": "Utah" }, { "code": "VT", "name": "Vermont" },
      { "code": "VA", "name": "Virginia" }, { "code": "WA", "name": "Washington" },
      { "code": "WV", "name": "West Virginia" }, { "code": "WI", "name": "Wisconsin" },
      { "code": "WY", "name": "Wyoming" }
    ],
    'categories': [{ "category": "BAR" },
    { "category": "CLUB" }, { "category": "LOUNGE" }, { "category": "CASINO" }, { "category": "RESTAURANT" },
    { "category": "HOTEL" }, { "category": "KARAOKE" }, { "category": "BOWLING" }],
    'roles': [{ "role": "General Manager" }, { "role": "Owner" }],
    'time': [
      { key: "00:00", value: "12:00 AM" },
      { key: "00:30", value: "12:30 AM" },
      { key: "01:00", value: "01:00 AM" },
      { key: "01:30", value: "01:30 AM" },
      { key: "02:00", value: "02:00 AM" },
      { key: "02:30", value: "02:30 AM" },
      { key: "03:00", value: "03:00 AM" },
      { key: "03:30", value: "03:30 AM" },
      { key: "04:00", value: "04:00 AM" },
      { key: "04:30", value: "04:30 AM" },
      { key: "05:00", value: "05:00 AM" },
      { key: "05:30", value: "05:30 AM" },
      { key: "06:00", value: "06:00 AM" },
      { key: "06:30", value: "06:30 AM" },
      { key: "07:00", value: "07:00 AM" },
      { key: "07:30", value: "07:30 AM" },
      { key: "08:00", value: "08:00 AM" },
      { key: "08:30", value: "08:30 AM" },
      { key: "09:00", value: "09:00 AM" },
      { key: "09:30", value: "09:30 AM" },
      { key: "10:00", value: "10:00 AM" },
      { key: "10:30", value: "10:30 AM" },
      { key: "11:00", value: "11:00 AM" },
      { key: "11:30", value: "11:30 AM" },
      { key: "12:00", value: "12:00 PM" },
      { key: "12:30", value: "12:30 PM" },
      { key: "13:00", value: "01:00 PM" },
      { key: "13:30", value: "01:30 PM" },
      { key: "14:00", value: "02:00 PM" },
      { key: "14:30", value: "02:30 PM" },
      { key: "15:00", value: "03:00 PM" },
      { key: "15:30", value: "03:30 PM" },
      { key: "16:00", value: "04:00 PM" },
      { key: "16:30", value: "04:30 PM" },
      { key: "17:00", value: "05:00 PM" },
      { key: "17:30", value: "05:30 PM" },
      { key: "18:00", value: "06:00 PM" },
      { key: "18:30", value: "06:30 PM" },
      { key: "19:00", value: "07:00 PM" },
      { key: "19:30", value: "07:30 PM" },
      { key: "20:00", value: "08:00 PM" },
      { key: "20:30", value: "08:30 PM" },
      { key: "21:00", value: "09:00 PM" },
      { key: "21:30", value: "09:30 PM" },
      { key: "22:00", value: "10:00 PM" },
      { key: "22:30", value: "10:30 PM" },
      { key: "23:00", value: "11:00 PM" },
      { key: "23:30", value: "11:30 PM" },
    ],

    'blogs': [
      { "title": "What is a Concierge Service? Facts You Should Know", "image": "assets/img/blog/concierge-service-1.png", "description": "A concierge is a caretaker or assistant who helps people with different tasks in hotels, resorts, and lounges. A concierge assists guests by managing various tasks such as,", "link": "concierge-service","bindHtml":"blogs/concierge-service.html" },
      { "title": "7 Facts to Consider Before Selecting Your Event Management Tool", "image": "assets/img/blog/event-management.png", "description": "In the olden days, we had fewer choices, and some brands used to have a monopoly and had the power to crush the small competitors, but that is not the scene today. Thanks to the internet and the era of technology, the crowded market offers customers with a lot of choices nowadays, no to mention, with so many options, there comes a headache too. How to choose the best product or service?", "link": "event-management", "bindHtml": "blogs/event-management.png" },
      { "title": "Our Exclusive Interview with the One and Only DJ Playboi", "image": "assets/img/blog/dj-playboi.jpg", "description": "We recently got a chance to interview the amazingly talented DJ Playboi. And, here we present to you the multi talented DJ Playboi and our amazing Q&A.", "link": "dj-playboi","bindHtml":"blogs/dj-Playboi.jpg" },
      { "title": "Bottle Service and Table Service - What Is the Difference?", "image": "assets/img/blog/bottlevstable.jpg", "description": "Bottle service and Table service are pretty popular in the major metropolitan cities. Many people are confused with the terms 'Bottle Service' and 'Table Service' ... ", "link": "Bottle-vs-Table-Service","bindHtml":"assets/img/blog/bottlevstable.jpg", },
      { "title": "7 Tips to Become a Successful Bar Manager", "image": "assets/img/blog/7tips-bar.png", "description": "The United States has so many bars, and all these bars have bar managers. Have you ever thought about being a bar manager? You just want to be a bar manager or a successful bar manager?", "link": "7tips-bar","bindHtml":"blogs/7tips-bar.html" },
      { "title": "Our Exclusive Interview with The Queen of Nightlife, Kat Bein", "image": "assets/img/blog/kat_bein.png", "description": "Kat Bein is the name when it comes to nightlife articles on the internet. Her amazing writing style and in depth knowledge on music has made her a notable influencer in the entertainment industry.", "link": "kat-bein","bindHtml":"blogs/kat_bein.html" },
      { "title": "Our Exclusive Interview With DJ Epps", "image": "assets/img/blog/DJEPPS.png", "description": "Today we have with us the DJ Epps to share his experience about Djing and other facets of his life.", "link": "dj-epps", "bindHtml":"blogs/DJ-Epps.html" },
      { "title": "Our Exclusive Interview with Official DJ West", "image": "assets/img/blog/Official-DJ-West.png", "description": "We had the opportunity to interview the Official DJ West, and it was fun talking to him and his journey towards becoming one of the best DJs. Below is the whole conversation we had with him. Sit back, relax and go through this fun interview.", "link": "Official-DJ-West","bindHtml":"blogs/Official-DJ-West.html" },
      { "title": "Las Vegas Nightlife and Bottle Service", "image": "assets/img/blog/las_vegas_bottle_service.png", "description": "Nobody really knows what happens in Vegas because everything that happens there, stays there.  But rumor has it that Las Vegas is the Disneyland for grownups.  Again, that is just a rumor!  You have to experience that on your own.", "link": "Las-Vegas-Nightlife", "bindHtml": "assets/img/blog/las_vegas_bottle_service.png" },
      { "title": "New York Nightlife and Bottle Service", "image": "assets/img/blog/new_york_nightlife_bottle.png", "description": "The Big Apple is best known for its nightlife and dining experience.  It offers entertainment and nightlife venues that city barely sleeps.  New York City is also home to many celebs, DJs, music artists, etc ", "link": "New-York-Nightlife","bindHtml":"blogs/New-York-Nightlife-bottle.html" },
      { "title": "New Orleans Nightlife and Bottle Service", "image": "assets/img/blog/new_orleans_nightlife_bottle.png", "description": "If you are looking for a unique Jazz infuse cultural experience than you must visit New Orleans. In many ways it is an authentic historical city with an amazing charming nightlife and diverse culture. ", "link": "New-Orleans-Nightlife","bindHtml":"blogs/New-Orleans-Nightlife-bottle.html" },
      { "title": "7 Mind Blowing Nightlife Cities in the United States", "image": "assets/img/blog/blog-1.jpg", "description": "Who doesn't like to Party? And who doesn't like Casinos, Clubs, and Live Music Bars? We all wait till Friday just to get our own time from the hectic busy schedules so that we go out and have some fun with our friends and family. When it comes to the United States, you will have many choices to have a good time, and it's hard to select one city over other since every city here has its own charisma. Well, let us all say TGIF and check out some mind blowing nightlife cities in the USA that will make you say 'WOW'.", "link": "7-Mind-Blowing-Nightlife-Cities-in-the-United-States","bindHtml":"blogs/blog-post-list.html" },
      { "title": "What Is Bottle Service and Facts You Should Know", "image": "assets/img/blog/blog-2.jpg", "description": "Bottle service is also called table service, and it is the ONLY way to secure a table at your favorite party place (Bar, Pub, Nightclub, etc.). Almost all clubs these days have VIP tables arranged throughout the club. The only way to get on the guest list and bypass the line for any bar/pub/nightclub is to reserve a table. Wikipedia defines bottle service as the sale of liquor by the bottle in most American lounges and nightclubs. The purchase of bottle service typically includes a reserved table for the patron's party and mixers of the patron's choice.", "link": "What-Is-Bottle-Service-and-Facts-You-Should-Know","bindHtml":"blogs/blog-bottle-service.html" },
      { "title": "What Is the Guest List and How to Get On It", "image": "assets/img/blog/blog-3.jpg", "description": "Guest list might be a bit confusing term to some people who are new to nightclubs, bars, and pubs. Today, we are going to explain this term and some more things attached to it. All these nightlife venues maintain their own dignity and culture, and you cannot just enter any nightclub and have your drinks. Well, you can go and have drinks, but at the famous places and the partying places with high demand, it is not easy.", "link": "What-Is-the-Guest-List-and-How-to-Get-On-It","bindHtml":"blogs/blog-guest-list.html" },
      { "title": "7 Nightlife Trends", "image": "assets/img/blog/blog-4.jpg", "description": "Businesses in the hospitality industry, must constantly change and adapt in a dynamic environment driven by technology and demand for better and faster services.  Equally, service differentiation is key to attracting new customers and retaining the exiting once.  These requirements are even more important when it comes to the new generation and the nightlife.", "link": "7-Nightlife-Trends-to-Follow","bindHtml":"assets/img/blog/blog-4.jpg" },
      { "title": "10 Tips to Setup a Nightclub", "image": "assets/img/blog/10-tips.jpg", "description": "We are back with yet another article and tips to share with you on creating the nightclub of tomorrow.", "link": "10-Tips-to-Setup-a-Nightclub-of-Tomorrow-Today","bindHtml":"blogs/10-Tips-to-Setup-Nightclub.html" },
      { "title": "How to Promote Nightlife", "image": "assets/img/blog/mil_1.png", "description": "Unlike Gen X, Millennials are between the ages of 18-35 of age and majority are about interaction social media and connecting over the smart phones.", "link": "How-to-Promote-Your-Nightlife-Venue-to-The-Millennials","bindHtml":"assets/img/blog/mil_1.png" },
      { "title": "7 Popular Cocktails Every Bartender and Cocktail Enthusiast Must Know", "image": "assets/img/blog/margarita_blog.jpg", "description": "A margarita is a cocktail of tequila, triple sec, and lime or lemon extract, usually served with salt on the rim of the glasses. The drink is served shaken with ice, blended with ice, or without ice.", "link": "7-Popular-Cocktails-Every-Bartender-and-Cocktail-Enthusiast-Must-Know","bindHtml":"assets/img/blog/margarita_blog.jpg" },
      { "title": "10 Must Visit Nightclubs in Las Vegas", "image": "assets/img/blog/Vegas_xs_nightclub.jpg", "description": "Nightlife industry is growing and always glowing. Along with the growing nightlife venues, the party trends are also changing. The night clubs nowadays must know how to market their services to right the audience. We agree with the increasing number of nightclubs in the country, but the charm of certain nightclubs never fads. We are here today with yet another exciting blog that shows the best ten must-visit nightclubs in the USA", "link": "10-Must-Visit-Nightclubs-in-Las-Vegas","bindHtml":"blogs/Las-vegas.html" },
      { "title": "Nyeelah, the face of New York Nightlife.", "image": "assets/img/blog/nyeelah_blogs.jpg", "description": "Hello Nightlife freaks, recently we interviewed a nightlife promoter from New York City to understand the nightlife scene in NYC  and something more. We interviewed Nyeelah, who is also known as the Face of New York nightlife. ", "link": "Nyeelah-the-face-of-New-York-Nightlife","bindHtml":"blogs/nyeelah-blog.html" },
      { "title": "7 Ways to Imporve Nightlife Online", "image": "assets/img/blog/blog-7ways.gif", "description": "Promoting an existing nightclub or a bar and growing the business can be a more challenging these days. As a new business, It is even more difficult to pass the six months mark.  Statistics show that 75% of new businesses fail in the first six months.", "link": "7-Incredible-Ways-To-Promote-Your-Nightlife-Venue-Online","bindHtml":"blogs/7-ways-nightlife-online.html" },
      //  {"title":"Mobile Tech Increases Crowds and Bottle Service Revenue for San Francisco Hot Spot", "image":"assets/img/blog/placeholder.gif", "description":"Mayes Oster House is a restaurant by day and dance club by night. Located on Polk Street in San Francisco, California, the restaurant uses VenueLytics to pack the house and increase its bottle service offerings.", "link":"Mobile-Tech-Increases-Crowds-and-Bottle-Service-Revenue-for-San-Francisco-Hot-Spot", "bindHtml": "blogs/Mobile-Tech-Increases-Crowds-and-Bottle-Service-Revenue-for-San-Francisco-Hot-Spot.html"},

    ],

    'nightlife': [{ "title": "7 Mind Blowing Nightlife Cities in the United States", "image": "assets/img/blog/blog-1.jpg", "description": "Who doesn't like to Party? And who doesn't like Casinos, Clubs, and Live Music? We count down to Fridays just cut lose and have a great time with friends. Regardless of the city you live in, when it comes to the night life, we may have many choices and sometimes it is hard to choose. Well, let us all say TGIF and check out some cities with awesome nightlife in the USA that will make you say 'WOW.'", "link": "nightlife" },
    { "title": "Las Vegas", "image": "assets/img/blog/city-1.jpg", "description": "Las Vegas has gained its status as America's playground for a valid reason. Some of the world's most riotous nightclubs stay in the city's glitzy hotels and casinos. Travel to Fremont Street for a break from the Strip. And apparently, every hotel on the Las Vegas Strip has at least one nightclub to keep you dancing and enjoying with your newest friends." },
    { "title": "New York", "image": "assets/img/blog/city-2.jpg", "description": "No city in the world has a wider variety of nightlife alternatives than New York. There are infinite ways to spend a night out. The Big Apple never sleeps. Each neighborhood has its own brand of craziness, from bottle-service clubs in the Meatpacking District to dive bars in the East Village. New York goes crazy every weekend and every street has something unique to offer." },
    { "title": "Miami", "image": "assets/img/blog/city-3.jpg", "description": "Miami offers a real nightlife; some people refer Miami as the capital of nightlife. You will be amazed to see the clubs and type of parties happen here. From poolside happy hours to hot nightclubs, complete with beautiful dancers and world-class DJs. In fact, you could say nightlife in Miami simply becomes day life with barely a break in between." },
    { "title": "New Orleans", "image": "assets/img/blog/city-4.jpg", "description": "New Orleans is a city that is known for its unique nightlife culture; it takes pride in it. When it comes to essential cocktail bars, this city is home to some of the oldest and most famous localities in the world. It's also a destination to a few newer drinking destinations that have been making waves in recent years. New Orleans has one of the best bar scenes in the world, with many of them open late night and the same goes for the music scene as well." },
    { "title": "Nashville", "image": "assets/img/blog/city-5.jpg", "description": "Legendary country music venues include the Grand Ole Opry House, home of the famous “Grand Ole Opry” stage and radio show. Live music dominates Nashville's nightlife scene. Bars, clubs and performance venues across the city boast well-known bands, local favorites almost every night of the week. Seriously, since every bar in Nashville has a story behind, so narrowing down Nashville’s best bars is no simple task." },
    { "title": "Austin", "image": "assets/img/blog/city-6.jpg", "description": "When it comes to Austin, you cannot ignore Sixth Street. Sixth Street is one of the most iconic streets in Austin today. It’s the epicenter of what made Austin the “Live Music Capital of the World.” Almost 200 venues offer rock, blues, jazz, hip hop, punk or Latino shows nightly." },
    { "title": "San Francisco", "image": "assets/img/blog/city-7.jpg", "description": "You name it, and San Francisco has it. Electronic music clubs, hip-hop or chill art lounges, Casinos, mind boggling bars, etc. Nighttime is the best time to enjoy the real beauty of this city. It offers tons of entertainment, from sexy lounges to hip nightclubs to that quintessential northern California trend of the wine bars. There are many other options available too, but these are the best cities we have chosen for you in the United States. Pick your city and have a great time. BTW, if you hate to wait in line, you can use 'ItzFun' app and just book your table and pre-order. And, if you are a club, pub or bar owner, you can streamline your business and guests by using our 'VenueLytics' app." },
    { "title": "Big City Nightlife", "image": "assets/img/blog/city-8.png", "description": "" }]
  })

  .constant('APP_COLORS', {
    'primary': '#5d9cec',
    'success': '#27c24c',
    'info': '#23b7e5',
    'warning': '#ff902b',
    'danger': '#f05050',
    'inverse': '#131e26',
    'green': '#37bc9b',
    'pink': '#f532e5',
    'purple': '#7266ba',
    'dark': '#3a3f51',
    'yellow': '#fad732',
    'gray-darker': '#232735',
    'gray-dark': '#3a3f51',
    'gray': '#dde6e9',
    'gray-light': '#e4eaec',
    'gray-lighter': '#edf1f2',
    'silver': '#cccccc',
    'fruitSalad': '#4caf50',
    'darkYellow': 'FFFF00',
    'darkGreen': '06B500',
    'red': 'FF0000',
    'guardsmanRed': 'C60000',
    'lightGreen': '08FF00',
    'turbo': 'E3E300',
  })

  .constant('APP_LINK', {
    "FACEBOOK_VENUELYTICS": "//www.facebook.com/venuelytics",
    "TWITTER_VENUELYTICS": "//www.twitter.com/venuelytics",
    "INSTAGRAM_VENUELYTICS": "//www.instagram.com/venuelytics",
    "FACEBOOK_ITZFUN": "//www.facebook.com/itzfunapp",
    "TWITTER_ITZFUN": "//www.twitter.com/itzfuninc",
    "INSTAGRAM_ITZFUN": "//www.instagram.com/itzfunapp",
    "APPLE_STORE_VENUELYTICS": "//itunes.apple.com/us/app/venuelytics-for-business/id1155767700?ls=1&mt=8",
    "APPLE_STORE_ITZFUN": "//itunes.apple.com/us/app/itzfun/id1035171101?mt=8",
    "GOOGLE_PLAY_VENUELYTICS": "//play.google.com/store/apps/details?id=com.itzfun.biz&hl=en",
    "GOOGLE_PLAY_ITZFUN": "//play.google.com/store/apps/details?id=com.itzfun&hl=en",
    "VIDEO_PLAY": "//www.youtube.com/watch?v=HZngJ7YtOuU"
  })

  .constant('PRICING_APP', {
    "MONTHLY_PRICE": "Monthly price",
    "PER_MONTH": "Per Month",
    "BASIC_PRICE": "99",
    "PROFESSIONAL_PRICE": "249",
    "ENTER_PRICE": "Contact For Pricing",
    "PLAN_FEATURE": "Plan Feature",
    "MONTHLY_PRICE": "Monthly price",
    "BASIC_FEE": "Basic",
    "FREE_TIER": "FREE",
    "FREE_PRICE": "0",
    "BASIC_FEE_IDEAL": "Ideal for Small Venues",
    "FREE_TIER_IDEAL": "Ideal for Starters",
    "PROFESSIONAL_FEE": "Professional",
    "PROFESSSIONAL_FEE_EVERYTHING": "Everything you need to grow your business",
    "ENTERPRISE_FEE": "Enterprise",
    "ENTERPRISE_FEE_ADVANCED": "Advanced features for Enterpise Level Services",
    "RESERVATION_PROMOTATION": "Reservation & Promotion",
    "RESERVATION_PROMOTATION_ARRAY": [
      { 'title': 'Table Reservation', 'FreeDetails': 'YES', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Private Event Booking', 'FreeDetails': 'YES', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Bottle Service', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Deals & Coupons', 'FreeDetails': 'YES', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Party Packages', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' }
    ],
    "PREMIUM_SERVICES": "Premium Services",
    "PREMIUM_SERVICES_ARRAY": [
     /* { 'title': 'Event & Ticketing', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Mobile Payment', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES (2.90% + $0.25)', 'enterPriseDetails': 'YES (2.45% + $0.25)' },
      { 'title': 'Artist/DJ Promotion', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Integration', 'FreeDetails': 'NO', 'basicDetails': '-', 'professionalDetails': '-', 'enterPriseDetails': '-' },
      { 'title': 'Social Media', 'FreeDetails': 'YES', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Web', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Mobile App/ItzFun', 'FreeDetails': 'YES', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'ChatBot', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'Landing Page', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Contest & Tournaments', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Business Analytics', 'FreeDetails': 'NO', 'basicDetails': 'BASIC', 'professionalDetails': 'FULL', 'enterPriseDetails': 'ADVANCED' },
      { 'title': 'Internal Messaging', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Guest List', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Fast Pass', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Lost & Found', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Valet Services', 'FreeDetails': 'NO', 'basicDetails': 'YES', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' },
      { 'title': 'Guest Registration', 'FreeDetails': 'NO', 'basicDetails': 'NO', 'professionalDetails': 'YES', 'enterPriseDetails': 'YES' }*/
    ],
    "WIFI_MONETIZATION": "WiFi Monetization",
    "WIFI_MONETIZATION_ARRAY": [
     /* { 'title': 'On-site Food/Drinks Ordering', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'VIP Services / Concierge', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'Digital Loyalty Management', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'Beacon Integration', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'White Label - Private App', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' },
      { 'title': 'Way Finder', 'basicDetails': 'NO', 'professionalDetails': 'NO', 'enterPriseDetails': 'YES' }*/
    ]
  });
