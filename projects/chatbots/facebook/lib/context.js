
class Node {
    
    constructor(parent) {
        this.prev = parent;
        this.next = null;
        if (parent != null) {
            parent.next = this;
        }
    }

    set(patternFn, callback) {
        this.patternFn = patternFn;
        this.contextHandler = callback;
    }

}
class Context {
    /**
     * Creates an instance of Context.
     */
    constructor(key) {
        this.key = key;
        this.handlers = null;
    }

    /**
     * Matcher method called when matching contexts and calls callback
     */

    /**
     */
    set(pattern, callback) {
        var patternFn = pattern;
        if(typeof patternFn !== 'function') {
            patternFn = function(text, cb) {
                let re = new RegExp(pattern, 'i');
                let match = re.exec(text);
                if (match && match.length > 0) {
                    return cb(null, match[0]);
                } else {
                    return null;
                }
            }
        }
        // Delete and set to ensure the new context is at the end.
        // According to spec, entries in map are stored in insertion order.
        //this.handlers.delete(patternFn);
        this.handlers = new Node(this.handlers)
        this.handlers.set(patternFn, callback);
    }

    
    isSet() {
        return this.handlers !== null;
    }

    match(text, cb) {
        if(!text) {
            return cb('input text cannot be empty');
        }
        var matchFound = false;
        const contextHandler = this.handlers.contextHandler;
        this.handlers.patternFn(text, function(err, match){
            if(!!match) {
                matchFound = true;
                return cb(
                    null,
                    match,
                    contextHandler
                );
            }
        });
        

        /*var handlerStack = [...this.handlers].reverse();
        var matchFound = false;
        for(let [pattern, contextHandler] of handlerStack) {
            pattern(text, function(err, match) {
                if(!!match) {
                    matchFound = true;
                    return cb(
                        null,
                        match,
                        contextHandler
                    );
                }
            });
        }
        */
        if (!matchFound) {
            return cb('No match found');
        }
    }
}


module.exports = Context;