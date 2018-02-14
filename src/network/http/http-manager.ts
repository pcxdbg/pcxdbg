import {HttpRequest} from './http-request';
import {HttpRequestInstance} from './http-request-instance';
import {HttpResponse} from './http-response';
import {Component} from 'es-injection';

/**
 * HTTP manager
 */
@Component
class HttpManager {

    /**
     * Execute an HTTP request
     * @param httpRequest HTTP request
     * @param <RQ>        Request type
     * @param <RS>        Response type
     * @return Promise that resolves to an HTTP response
     */
    executeHttpRequest<RQ, RS>(httpRequest: HttpRequest<RQ>): Promise<HttpResponse<RS>> {
        let httpRequestInstance: HttpRequestInstance<RQ, RS> = new HttpRequestInstance<RQ, RS>(httpRequest);
        return httpRequestInstance.getPromise();
    }

}

export {
    HttpManager
};
