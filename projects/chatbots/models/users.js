'use strict';

const chatContextFactory = require( '../lib/chat-context');
const chatContext = chatContextFactory.getOrCreate("chatContext");

const users = [];

const getUser = (userId) => {
    let user = users.find((u) => u.id === userId);
    
    if (typeof(user) === 'undefined') {
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
    isNotEmpty(str) {
        return !(!str || 0 === str.length);
    }
    hasParameter(parameterName) {
        return this.isNotEmpty(this._state.get(parameterName));
    }

    isInConversation() {
        return this.conversationContext !== null && this.conversationContext.isSet();
    }
    ignoreTextProcessing() {
        return this.conversationContext !== null  && this.conversationContext.ignoreTextProcessing(); 
    }
    
    setConversationContext(type, ignoreTextProcessing, fxCallback, callbackResponse) {
        this.conversationContext = chatContext.getOrCreate(this._id);
        this.conversationContext.setCallbackResponse(callbackResponse);
        this.conversationContext.set(/.*/, ignoreTextProcessing, (userId, match, response) => fxCallback(userId, match, type, response));
    }
    
    dispatch(response, channel) {
        var type = response.queryText;
        var senderId = this._id;
        if (this.conversationContext !== null && this.conversationContext.isSet()) {
            var callbackResponse = this.conversationContext.callbackResponse;
            this.conversationContext.match(type, function (err, match, contextCb) {
                if (!err) {
                    if (!callbackResponse) {
                        contextCb(channel, senderId, match, response);
                    } else {
                        contextCb(channel, senderId, match, callbackResponse);
                    }
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