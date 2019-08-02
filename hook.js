// Only responseText and response properties are hooked.
var _XMLHttpRequest = XMLHttpRequest;
XMLHttpRequest = class XMLHttpRequest extends _XMLHttpRequest {
    constructor() {
        super();
        this.hookProperty("responseText", this.get_responseText);
        this.hookProperty("response", this.get_response);
    }
    //TODO: Seperate response from responseText. Tip: Check this.responseType
    get_response() {
        return this.responseIntercept();
    }
    get_responseText() {
        return this.responseIntercept();
    }
    responseIntercept() {
        delete this.response;   //Remove getter
        var modifiedResponse = XMLHttpRequest.responseModify(this.response);    //Access self.response w/o getter (due to a weird situation caused by native code)
        this.hookProperty("response", this.get_response); //Add getter again
        return modifiedResponse;
    }
    hookProperty(propName="response", getterFunc=this.get_response) {
        Object.defineProperty(this, propName, {
            get: getterFunc,
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
