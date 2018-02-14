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

    isInConversation() {
        return this.conversationContext !== null && this.conversationContext.isSet();
    }

    setConversationContext(type, response, fxCallback) {
        this.conversationContext = chatContext.getOrCreate(this._id);
        this.conversationContext.set(/.*/, (userId, match) => fxCallback(userId, match, type, response));
    }
    dispatch(response) {
        var type = response.queryText;
        var senderId = this._id;
        if (this.conversationContext != null && this.conversationContext.isSet()) {
            this.conversationContext.match(type, function (err, match, contextCb) {
                if (!err) {
                  contextCb(senderId, match);
                } 
              });
        }
        
    }
    
    clear() {
        this._state = new Map();
        this.conversationContext = null;
        chatContext.removeContext(this._id);
    }
}

module.exports = {
    getUser : getUser
};