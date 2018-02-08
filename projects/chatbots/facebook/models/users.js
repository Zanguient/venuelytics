'use strict';

const chatContextFactory = require( '../lib/chat-context');
const chatContext = chatContextFactory.getOrCreate("chatContext");

const users = [];

const getUser = (userId) => {
    let user = users.find((u) => u.id === userId);
    
    if (typeof(user) == 'undefined') {
        user =  new User(userId);
        users.push(user);
    }

    return user;

  };

class User {
     constructor(id) {
         this._id = id;
         this._state = new Map();
         this.conversationContext = null;
     }
    get id() {
        return this._id;
    }
    set id(_id) {
        this._id = _id;
    }
    get state() {
        return this._state;
    }

    hasConversationContext() {
        return this.conversationContext !== null && this.conversationContext.isSet();
    }

    getOrCreateContext() {
        this.conversationContext = chatContext.getOrCreate(this._id);
        return this.conversationContext;
    }
    
    clear() {
        this._state = new Map();
        this.conversationContext = null;
    }
}

module.exports = {
    getUser : getUser
};