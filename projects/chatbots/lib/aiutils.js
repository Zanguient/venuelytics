"use strict";

function hasParam(response, name, value) {
    if (response && response.parameters) {
        let nameValue = response.parameters[name];
        if (!!value) {
            
            if (nameValue && Array.isArray(nameValue)) {
                return nameValue.indexOf(value) > -1;
            } else {
                return nameValue && (nameValue.toLowerCase() === value || nameValue.toLowerCase().indexOf(value) > -1);
            }
        } else {
            return nameValue && nameValue.length > 0;    
        }
    }
    return false;
}


module.exports = {
    hasParam: hasParam
};
