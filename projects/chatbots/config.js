'use strict';

const config = {}; 
config.service = {}; 
config.service.port = process.env.PORT || 9000;
config.devMode = true
//process.env.PROD || false;
config.WEBHOOK_TOKEN = "venuelytics-fb-agent-EAAcYqcwl1BwBANOAT";
config.PAGE_ACCESS_TOKEN = "EAAcYqcwl1BwBANOATkspAplSbNdTDvXmbhyE8VdnQj44yjvfJROCcEn7uVy6NYZAPmbAQyZCxgzjbFNQQ5uN94ZB28ZAIoKewqSxCEUmHBdZAjL8MOh8BZBrtgh43AmLr708IHZBV0ZC8DedkvR8PYb8D8MiEWOT7U9vBC2KDPb3VgZDZD";

//const DEV_SRVR = 'https://dev.api.venuelytics.com';
const DEV_SRVR = 'http://localhost:8080';
const PROD_SRVR = 'https://prod.api.venuelytics.com';


config.ai_client_access_token = 'f90c7a6106fa420a9d1f7cb4078cbaf0';
config.getAppUrl = () => {
    return config.devMode ? `${DEV_SRVR}/WebServices/rsapi/v1`: `${PROD_SRVR}/WebServices/rsapi/v1`;
};

config.accountSid = 'AC273fe799ac5d6af28239e657c3457f80';
config.authToken = '1bf72c4bb389d44d3cbd0de4acc2e73c';

config.smsDebug = true;
config.sms_agent_number = '+15102983683',
config.getPort = () => {
    return config.service.port;
};

module.exports = config;

