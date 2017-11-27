import {HttpHeaderMap} from './http-header-map';

/**
 * HTTP request
 * @param <RQ> Request type
 */
interface HttpRequest<RQ> {
    method: string;
    url: string;
    headers?: HttpHeaderMap;
    data?: RQ;
}

export {
    HttpRequest
};
