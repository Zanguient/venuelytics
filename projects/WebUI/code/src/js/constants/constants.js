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
    				  {'image': 'assets/img/clients/wine-jar.png', 'link': 'http://winejar-sf.com/'},
                      {'image': 'assets/img/clients/mayes.png', 'link': 'http://www.mayessf.com/'},
                      {'image': 'assets/img/clients/fan.png', 'link': 'https://www.spriza.com/'},
                      {'image': 'assets/img/clients/shboom.jpg', 'link': 'http://www.shboomnightclub.com/'}
                      ]
  })
  .constant('APP_ARRAYS', {
    'country': [{"countryName": "North America", "shortName": "USA"},
                {"countryName": "Canada", "shortName": "CANADA"},
                {"countryName": "South America", "shortName": "SAM"},
                {"countryName": "India", "shortName": "IND"}],
    'serviceTabs': [{'title': 'CLUB', 'icon': 'assets/img/ic_club.png'},
                    {'title': 'CASINO', 'icon': 'assets/img/ic_casino.png'},
                    {'title': 'BAR', 'icon': 'assets/img/ic_bar.png'},
                    {'title': 'KARAOKE', 'icon': 'assets/img/ic_karaoke.png'},
                    {'title': 'BOWLING', 'icon': 'assets/img/ic_bowling.png'},
                    {'title': 'RESTAURANT', 'icon': 'assets/img/ic_restaurant.png'}],
    'features': [{'title': 'FEATURE_REAL_TIME_RES', 'description':'FEATURE_REAL_TIME_DESC', 'image': 'assets/img/ic_reservations.png', 'color': 'color-info'},
                 {'title': 'FEATURE_FOOD_DRINK', 'description':'FEATURE_FOOD_DRINK_DESC', 'image': 'assets/img/ic_fooddrink.png', 'color': 'color-warning'},
                 {'title': 'FEATURE_GUEST_LIST', 'description':'FEATURE_GUEST_LIST_DESC', 'image': 'assets/img/ic_guestlist.png', 'color': 'color-success'},
                 {'title': 'FEATURE_ORDER_PAY', 'description':'FEATURE_ORDER_PAY_DESC', 'image': 'assets/img/ic_payments.png', 'color': 'color-danger'},
                 {'title': 'FEATURE_BUSINESS', 'description':'FEATURE_BUSINESS_DESC', 'image': 'assets/img/ic_analytics.png', 'color': 'color-info'},
                 {'title': 'FEATURE_WIFI', 'description':'FEATURE_WIFI_DESC', 'image': 'assets/img/ic_wifi.png', 'color': 'color-warning'},
                 {'title': 'FEATURE_PRIVATE_EVENT',
                            'description':'FEATURE_PRIVATE_EVENT_DESC', 'image': 'assets/img/ic_privatevent.png', 'color': 'color-success'},
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
    'roles': [{"role":"General Manager"}, {"role":"Owner"}],
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
    'blogPosts':{
      "bottle-service":"blogs/blog-bottle-service.html",
      "guest-list":"blogs/blog-guest-list.html",
      "nightlife":"blogs/blog-post-list.html",
      "nightlife-trends":"blogs/blog-nightlife-trends.html",
      "7-ways-nightlife":"blogs/7-ways-nightlife-online.html"
    },
    'blogs': [{"title":"7 Mind Blowing Nightlife Cities in the United States", "image":"assets/img/blog/blog-1.jpg", "description":"Who doesn't like to Party? And who doesn't like Casinos, Clubs, and Live Music Bars? We all wait till Friday just to get our own time from the hectic busy schedules so that we go out and have some fun with our friends and family. When it comes to the United States, you will have many choices to have a good time, and it's hard to select one city over other since every city here has its own charisma. Well, let us all say TGIF and check out some mind blowing nightlife cities in the USA that will make you say 'WOW'.", "link":"nightlife"},
              {"title":"What Is Bottle Service and Facts You Should Know", "image":"assets/img/blog/blog-2.jpg", "description":"Bottle service is also called table service, and it is the ONLY way to secure a table at your favorite party place (Bar, Pub, Nightclub, etc.). Almost all clubs these days have VIP tables arranged throughout the club. The only way to get on the guest list and bypass the line for any bar/pub/nightclub is to reserve a table. Wikipedia defines bottle service as the sale of liquor by the bottle in most American lounges and nightclubs. The purchase of bottle service typically includes a reserved table for the patron's party and mixers of the patron's choice.", "link":"bottle-service"},
              {"title":"What Is the Guest List and How to Get On It", "image":"assets/img/blog/blog-3.jpg", "description":"Guest list might be a bit confusing term to some people who are new to nightclubs, bars, and pubs. Today, we are going to explain this term and some more things attached to it. All these nightlife venues maintain their own dignity and culture, and you cannot just enter any nightclub and have your drinks. Well, you can go and have drinks, but at the famous places and the partying places with high demand, it is not easy.", "link":"guest-list"},
              {"title":"7 Nightlife Trends", "image":"assets/img/blog/blog-4.jpg", "description":"Businesses in the hospitality industry, must constantly change and adapt in a dynamic environment driven by technology and demand for better and faster services.  Equally, service differentiation is key to attracting new customers and retaining the exiting once.  These requirements are even more important when it comes to the new generation and the nightlife.", "link":"nightlife-trends"},
              {"title":"7 Ways to Imporve Nightlife Online", "image":"assets/img/blog/blog-7ways.gif", "description":"Promoting an existing nightclub or a bar and growing the business can be a more challenging these days. As a new business, It is even more difficult to pass the six months mark.  Statistics show that 75% of new businesses fail in the first six months.", "link":"7-ways-nightlife"}],
    
    'nightlife': [{"title":"7 Mind Blowing Nightlife Cities in the United States", "image":"assets/img/blog/blog-1.jpg", "description":"Who doesn't like to Party? And who doesn't like Casinos, Clubs, and Live Music? We count down to Fridays just cut lose and have a great time with friends. Regardless of the city you live in, when it comes to the night life, we may have many choices and sometimes it is hard to choose. Well, let us all say TGIF and check out some cities with awesome nightlife in the USA that will make you say 'WOW.'", "link":"nightlife"},
                  {"title":"Las Vegas", "image":"assets/img/blog/city-1.jpg", "description":"Las Vegas has gained its status as America's playground for a valid reason. Some of the world's most riotous nightclubs stay in the city's glitzy hotels and casinos. Travel to Fremont Street for a break from the Strip. And apparently, every hotel on the Las Vegas Strip has at least one nightclub to keep you dancing and enjoying with your newest friends."},
                  {"title":"New York", "image":"assets/img/blog/city-2.jpg", "description":"No city in the world has a wider variety of nightlife alternatives than New York. There are infinite ways to spend a night out. The Big Apple never sleeps. Each neighborhood has its own brand of craziness, from bottle-service clubs in the Meatpacking District to dive bars in the East Village. New York goes crazy every weekend and every street has something unique to offer."},
                  {"title":"Miami", "image":"assets/img/blog/city-3.jpg", "description":"Miami offers a real nightlife; some people refer Miami as the capital of nightlife. You will be amazed to see the clubs and type of parties happen here. From poolside happy hours to hot nightclubs, complete with beautiful dancers and world-class DJs. In fact, you could say nightlife in Miami simply becomes day life with barely a break in between."},
                  {"title":"New Orleans", "image":"assets/img/blog/city-4.jpg", "description":"New Orleans is a city that is known for its unique nightlife culture; it takes pride in it. When it comes to essential cocktail bars, this city is home to some of the oldest and most famous localities in the world. It's also a destination to a few newer drinking destinations that have been making waves in recent years. New Orleans has one of the best bar scenes in the world, with many of them open late night and the same goes for the music scene as well."},
                  {"title":"Nashville", "image":"assets/img/blog/city-5.jpg", "description":"Legendary country music venues include the Grand Ole Opry House, home of the famous “Grand Ole Opry” stage and radio show. Live music dominates Nashville's nightlife scene. Bars, clubs and performance venues across the city boast well-known bands, local favorites almost every night of the week. Seriously, since every bar in Nashville has a story behind, so narrowing down Nashville’s best bars is no simple task."},
                  {"title":"Austin", "image":"assets/img/blog/city-6.jpg", "description":"When it comes to Austin, you cannot ignore Sixth Street. Sixth Street is one of the most iconic streets in Austin today. It’s the epicenter of what made Austin the “Live Music Capital of the World.” Almost 200 venues offer rock, blues, jazz, hip hop, punk or Latino shows nightly."},
                  {"title":"San Francisco", "image":"assets/img/blog/city-7.jpg", "description":"You name it, and San Francisco has it. Electronic music clubs, hip-hop or chill art lounges, Casinos, mind boggling bars, etc. Nighttime is the best time to enjoy the real beauty of this city. It offers tons of entertainment, from sexy lounges to hip nightclubs to that quintessential northern California trend of the wine bars. There are many other options available too, but these are the best cities we have chosen for you in the United States. Pick your city and have a great time. BTW, if you hate to wait in line, you can use 'ItzFun' app and just book your table and pre-order. And, if you are a club, pub or bar owner, you can streamline your business and guests by using our 'VenueLytics' app."},
                  {"title":"Big City Nightlife", "image":"assets/img/blog/city-8.png", "description":""}]
  })

.constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2',
    'silver':                 '#cccccc',
    'fruitSalad':             '#4caf50',
    'darkYellow':            'FFFF00',
    'darkGreen':             '06B500',
    'red':                    'FF0000',
    'guardsmanRed':           'C60000',
    'lightGreen':            '08FF00',
    'turbo':                  'E3E300'
  });
