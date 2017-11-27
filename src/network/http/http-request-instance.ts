import {HttpHeaderMap} from './http-header-map';
import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';

/**
 * HTTP request instance
 * @param <RQ> Request type
 * @param <RS> Response type
 */
class HttpRequestInstance<RQ, RS> {
    private static HEADER_SEPARATOR: string = '\u000d\u000a';
    private static HEADERVALUE_SEPARATOR: string = '\u003a\u0020';
    private static HEADERNAME_CONTENTTYPE: string = 'content-type';
    private static REGEXP_JSON: RegExp = /\+json$/;

    private xmlHttpRequest: XMLHttpRequest;
    private httpRequest: HttpRequest<RQ>;
    private promise: Promise<HttpResponse<RS>>;
    private promiseResolve: (value?: any) => void;
    private promiseReject: (reason?: any) => void;

    /**
     * Class constructor
     * @param httpRequest HTTP request
     */
    constructor(httpRequest: HttpRequest<RQ>) {
        this.promise = new Promise((resolve, reject) => {
            this.httpRequest = httpRequest;
            this.xmlHttpRequest = new XMLHttpRequest();
            this.xmlHttpRequest.addEventListener('load', event => this.onRequestLoad(event));
            this.xmlHttpRequest.addEventListener('error', errorEvent => this.onRequestError(errorEvent));
            this.xmlHttpRequest.open(httpRequest.method, httpRequest.url);
            this.xmlHttpRequest.send();
            this.promiseResolve = resolve;
            this.promiseReject = reject;
        });
    }

    /**
     * Get the promise
     * @return Promise
     */
    getPromise(): Promise<HttpResponse<RS>> {
        return this.promise;
    }

    /**
     * Callback triggered when a request loads
     * @param event Event
     */
    private onRequestLoad(event: Event): void {
        let responseHeaders: HttpHeaderMap = this.parseResponseHeaders();
        let httpResponse: HttpResponse<any> = {
            statusCode: this.xmlHttpRequest.status,
            headers: responseHeaders,
            data: this.parseResponseData(responseHeaders)
        };

        if (httpResponse.statusCode < 300 || typeof(httpResponse.data) !== 'string') {
            this.promiseResolve(httpResponse);
        } else {
            this.promiseReject(httpResponse);
        }
    }

    /**
     * Callback triggered when a request fails
     * @param errorEvent Error event
     */
    private onRequestError(errorEvent: ErrorEvent): void {
        console.error('HTTP request failed', errorEvent);
        this.promiseReject('HTTP request failed');
    }

    /**
     * Parse the response headers
     * @return Header map
     */
    private parseResponseHeaders(): HttpHeaderMap {
        let headerString: string = this.xmlHttpRequest.getAllResponseHeaders();
        let headers: HttpHeaderMap = {};

        if (headerString) {
            let headerPair: string;

            for (headerPair of headerString.split(HttpRequestInstance.HEADER_SEPARATOR)) {
                let separatorIndex: number = headerPair.indexOf(HttpRequestInstance.HEADERVALUE_SEPARATOR);
                if (separatorIndex > 0) {
                    let headerName: string = headerPair.substring(0, separatorIndex);
                    let headerValue: string = headerPair.substring(separatorIndex + 2);
                    headers[headerName] = headerValue;
                }
            }
        }

        return headers;
    }

    /**
     * Parse the response data
     * @param responseHeaders Response headers
     * @return Parsed data
     */
    private parseResponseData(responseHeaders: HttpHeaderMap): any {
        let responseText: string = this.xmlHttpRequest.responseText;
        let contentType: string = responseHeaders[HttpRequestInstance.HEADERNAME_CONTENTTYPE];

        if (contentType && contentType.match(HttpRequestInstance.REGEXP_JSON)) {
            return JSON.parse(responseText);
        }

        return responseText;
    }

}

export {
    HttpRequestInstance
};
