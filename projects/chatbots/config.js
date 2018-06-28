'use strict';

const config = {}; 
config.service = {}; 
config.service.port = process.env.PORT || 9000;
config.devMode = !process.env.PROD || false;
config.WEBHOOK_TOKEN = "venuelytics-fb-agent-EAAcYqcwl1BwBANOAT";
config.PAGE_ACCESS_TOKEN = "EAAcYqcwl1BwBANOATkspAplSbNdTDvXmbhyE8VdnQj44yjvfJROCcEn7uVy6NYZAPmbAQyZCxgzjbFNQQ5uN94ZB28ZAIoKewqSxCEUmHBdZAjL8MOh8BZBrtgh43AmLr708IHZBV0ZC8DedkvR8PYb8D8MiEWOT7U9vBC2KDPb3VgZDZD";

const DEV_SRVR = 'https://dev.api.venuelytics.com';
const LOCAL_SRVR = 'http://localhost:8080';
const PROD_SRVR = 'https://prod.api.venuelytics.com';

const DEV_WEBUI = "http://dev.api.venuelytics.com";
const PROD_WEBUI = "https://www.venuelytics.com";
const LOCAL_WEBUI = "http://localhost:8000/";


config.ai_client_access_token = 'f90c7a6106fa420a9d1f7cb4078cbaf0';
config.getAppUrl = () => {
    console.log("LOCAL: " +process.env.LOCAL);
    if (process.env.LOCAL === 'true') {
        return `${LOCAL_SRVR}/WebServices/rsapi/v1`;
    } else {
        return config.devMode ? `${DEV_SRVR}/WebServices/rsapi/v1`: `${PROD_SRVR}/WebServices/rsapi/v1`;
    }
    
};

config.getWebUIUrl = () => {
    return config.devMode ? `${DEV_WEBUI}`: `${PROD_WEBUI}`;
};


//config.accountSid = 'AC273fe799ac5d6af28239e657c3457f80';
//config.authToken = '1bf72c4bb389d44d3cbd0de4acc2e73c';

config.accountSid =  'AC227acd740f9ff82b02f09298a8c13e0d';
config.authToken = "1d9fa8df3728c108929887407cc0c552";

config.smsDebug = (process.env.PROD === "false" ) || false;
console.log("sms bebug: " + config.smsDebug);
config.sms_debug_agent_number = '+17025000196';
config.getPort = () => {
    return config.service.port;
};
config.session_secret = "venuelytics-secret-bcef-0000-cddc";
module.exports = config;

