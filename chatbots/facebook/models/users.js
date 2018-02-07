'use strict';
const users = [];

const getUser = (userId) => {
    let user = users.find((u) => u.id === userId);
    
    if (typeof(user) == 'undefined') {
        user =  {};
        user.id = userId;
        user.state = new Map();
        users.push(user);
    }

    return user;

  };

module.exports = {
    getUser : getUser
};