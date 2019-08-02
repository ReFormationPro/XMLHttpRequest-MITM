// Only responseText and response properties are hooked.
var _XMLHttpRequest = XMLHttpRequest;
XMLHttpRequest = class XMLHttpRequest extends _XMLHttpRequest {
    constructor() {
        super();
        this.hookResponseText();
        this.hookResponse();
    }
    get_response() {
        return this.responseIntercept();
    }
    get_responseText() {
        return this.responseIntercept();
    }
    responseIntercept() {
        delete this.response;   //Remove getter
        var modifiedResponse = XMLHttpRequest.responseModify(this.response);    //Access self.response w/o getter (due to a weird situation caused by native code)
        this.hookResponse(); //Add getter again
        return modifiedResponse;
    }
    hookResponse() {
        Object.defineProperty(this, "response", {
            get: this.get_response,
            configurable: true
        });
    }
    hookResponseText() {
        Object.defineProperty(this, "responseText", {
            get: this.get_responseText,
            configurable: true
        });
    }
    /*
     *  You are supposed to override this function to modify response.
     */
    static responseModify(resp) {
        return resp;
    }
}
