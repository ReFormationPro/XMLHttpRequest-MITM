//responseText and response properties and open method are hooked.
var _XMLHttpRequest = XMLHttpRequest;
window.XMLHttpRequest = class XMLHttpRequest extends _XMLHttpRequest {
    constructor() {
        super();
        this.hookProperty("responseText", this.get_responseText);
        this.hookProperty("response", this.get_response);
    }
    open() {
        var args = XMLHttpRequest.openModify(arguments);
        return super.open.apply(this, args);
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
        var modifiedResponse = XMLHttpRequest.responseModify(this.response, this);    //Access self.response w/o getter (due to a weird situation caused by native code)
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
    static responseModify(resp, xhrObj) {
        return resp;
    }
    static openModify(args) {
        return args;
    }
    static releaseHook() {
        //Release already hooked XHR objects
        delete XMLHttpRequest.prototype.open;   //XMLHttpRequest.openModify = (args) => {return args};
        XMLHttpRequest.responseModify = (resp, xhrObj) => {return resp};
        //Release hooking any future XHR objects
        window.XMLHttpRequest = _XMLHttpRequest;
    }
}
