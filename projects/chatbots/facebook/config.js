'use strict';

const config = {}; 
config.service = {}; 
config.service.port = process.env.PORT || 9000;
config.devMode = true
//process.env.PROD || false;
config.WEBHOOK_TOKEN = "venuelytics-fb-agent-EAAcYqcwl1BwBANOAT";
config.PAGE_ACCESS_TOKEN = "EAAcYqcwl1BwBANOATkspAplSbNdTDvXmbhyE8VdnQj44yjvfJROCcEn7uVy6NYZAPmbAQyZCxgzjbFNQQ5uN94ZB28ZAIoKewqSxCEUmHBdZAjL8MOh8BZBrtgh43AmLr708IHZBV0ZC8DedkvR8PYb8D8MiEWOT7U9vBC2KDPb3VgZDZD";

const DEV_SRVR = 'https://dev.api.venuelytics.com';
const PROD_SRVR = 'https://prod.api.venuelytics.com';


config.getAppUrl = () => {
    return config.devMode ? `${DEV_SRVR}/WebServices/rsapi/v1`: `${PROD_SRVR}/WebServices/rsapi/v1`;
};

config.getPort = () => {
    return config.service.port;
};

module.exports = config;